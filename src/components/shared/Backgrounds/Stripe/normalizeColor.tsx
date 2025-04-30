/*
 *   Ulibero WebGl Gradient Animation by Ulibero.com
 *   ScrollObserver functionality to disable animation when not scrolled into view has been disabled and
 *   commented out for now.
 */
//@ts-nocheck
// Converting colors to proper format
function normalizeColor(hexCode: number): [number, number, number] {
  return [
    ((hexCode >> 16) & 255) / 255,
    ((hexCode >> 8) & 255) / 255,
    (255 & hexCode) / 255,
  ];
}

// Color blend modes
const BLEND_MODES = ["SCREEN", "LINEAR_LIGHT"].reduce(
  (hexCode, t, n) => Object.assign(hexCode, { [t]: n }),
  {} as Record<string, number>
);

// Types for uniforms and attributes
type UniformType =
  | "float"
  | "int"
  | "vec2"
  | "vec3"
  | "vec4"
  | "mat4"
  | "array"
  | "struct";
type AttributeTarget = number;
type AttributeType = number;

interface UniformOptions {
  type: UniformType;
  value: any;
  excludeFrom?: string;
  transpose?: boolean;
}

interface AttributeOptions {
  target: AttributeTarget;
  size: number;
  type?: AttributeType;
  normalized?: boolean;
}

interface WaveLayer {
  color: Uniform;
  noiseFreq: Uniform;
  noiseSpeed: Uniform;
  noiseFlow: Uniform;
  noiseSeed: Uniform;
  noiseFloor: Uniform;
  noiseCeil: Uniform;
}

interface VertDeform {
  incline: Uniform;
  offsetTop: Uniform;
  offsetBottom: Uniform;
  noiseFreq: Uniform;
  noiseAmp: Uniform;
  noiseSpeed: Uniform;
  noiseFlow: Uniform;
  noiseSeed: Uniform;
}

interface GlobalUniforms {
  noiseFreq: Uniform;
  noiseSpeed: Uniform;
}

interface GradientConf {
  presetName: string;
  wireframe: boolean;
  density: [number, number];
  zoom: number;
  rotation: number;
  playing: boolean;
}

// Essential functionality of WebGl
// t = width
// n = height
class MiniGl {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  meshes: Mesh[];
  width: number;
  height: number;
  lastDebugMsg: number;
  debug: (...args: any[]) => void;
  commonUniforms: Record<string, Uniform>;

  constructor(
    canvas: HTMLCanvasElement,
    width?: number,
    height?: number,
    debug = false
  ) {
    const _miniGl = this;
    const debug_output =
      document.location.search.toLowerCase().indexOf("debug=webgl") !== -1;

    _miniGl.canvas = canvas;
    _miniGl.gl = _miniGl.canvas.getContext("webgl", {
      antialias: true,
    }) as WebGLRenderingContext;

    _miniGl.meshes = [];

    const context = _miniGl.gl;

    width && height && this.setSize(width, height);

    _miniGl.lastDebugMsg = 0;
    _miniGl.debug =
      debug && debug_output
        ? (e: string) => {
            const t = new Date().getTime();
            if (t - _miniGl.lastDebugMsg > 1000) console.log("---");
            console.log(
              t.toLocaleTimeString() +
                Array(Math.max(0, 32 - e.length)).join(" ") +
                e +
                ": ",
              ...Array.from(arguments).slice(1)
            );
            _miniGl.lastDebugMsg = t;
          }
        : () => {};

    // Define Material class
    Object.defineProperties(_miniGl, {
      Material: {
        enumerable: false,
        value: class Material {
          vertexShader: WebGLShader;
          fragmentShader: WebGLShader;
          program: WebGLProgram;
          uniforms: Record<string, Uniform>;
          uniformInstances: {
            uniform: Uniform;
            location: WebGLUniformLocation;
          }[];
          vertexSource: string;
          Source: string;

          constructor(
            vertexShaders: string,
            fragments: string,
            uniforms: Record<string, Uniform> = {}
          ) {
            function getShaderByType(
              type: number,
              source: string
            ): WebGLShader {
              const shader = context.createShader(type) as WebGLShader;
              context.shaderSource(shader, source);
              context.compileShader(shader);

              if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
                console.error(context.getShaderInfoLog(shader));
              }

              _miniGl.debug("Material.compileShaderSource", {
                source: source,
              });

              return shader;
            }

            function getUniformVariableDeclarations(
              uniforms: Record<string, Uniform>,
              type: string
            ): string {
              return Object.entries(uniforms)
                .map(([uniform, value]) => value.getDeclaration(uniform, type))
                .join("\n");
            }

            this.uniforms = uniforms;
            this.uniformInstances = [];

            const prefix =
              "\n              precision highp float;\n            ";

            this.vertexSource = `
                  ${prefix}
                  attribute vec4 position;
                  attribute vec2 uv;
                  attribute vec2 uvNorm;
                  ${getUniformVariableDeclarations(
                    _miniGl.commonUniforms,
                    "vertex"
                  )}
                  ${getUniformVariableDeclarations(uniforms, "vertex")}
                  ${vertexShaders}
                `;

            this.Source = `
                  ${prefix}
                  ${getUniformVariableDeclarations(
                    _miniGl.commonUniforms,
                    "fragment"
                  )}
                  ${getUniformVariableDeclarations(uniforms, "fragment")}
                  ${fragments}
                `;

            this.vertexShader = getShaderByType(
              context.VERTEX_SHADER,
              this.vertexSource
            );
            this.fragmentShader = getShaderByType(
              context.FRAGMENT_SHADER,
              this.Source
            );
            this.program = context.createProgram() as WebGLProgram;

            context.attachShader(this.program, this.vertexShader);
            context.attachShader(this.program, this.fragmentShader);
            context.linkProgram(this.program);

            if (
              !context.getProgramParameter(this.program, context.LINK_STATUS)
            ) {
              console.error(context.getProgramInfoLog(this.program));
            }

            context.useProgram(this.program);

            this.attachUniforms(undefined, _miniGl.commonUniforms);
            this.attachUniforms(undefined, this.uniforms);
          }

          // t = uniform
          attachUniforms(
            name?: string,
            uniforms?: Record<string, Uniform> | Uniform
          ): void {
            if (name === undefined) {
              Object.entries(uniforms as Record<string, Uniform>).forEach(
                ([name, uniform]) => {
                  this.attachUniforms(name, uniform);
                }
              );
            } else if ((uniforms as Uniform).type === "array") {
              (uniforms as Uniform).value.forEach(
                (uniform: Uniform, i: number) =>
                  this.attachUniforms(`${name}[${i}]`, uniform)
              );
            } else if ((uniforms as Uniform).type === "struct") {
              Object.entries((uniforms as Uniform).value).forEach(
                ([uniform, i]) =>
                  this.attachUniforms(`${name}.${uniform}`, i as Uniform)
              );
            } else {
              _miniGl.debug("Material.attachUniforms", {
                name: name,
                uniform: uniforms,
              });

              this.uniformInstances.push({
                uniform: uniforms as Uniform,
                location: context.getUniformLocation(
                  this.program,
                  name
                ) as WebGLUniformLocation,
              });
            }
          }
        },
      },
      Uniform: {
        enumerable: false,
        value: class Uniform {
          type: UniformType;
          value: any;
          typeFn: string;
          excludeFrom?: string;
          transpose?: boolean;

          constructor(e: Partial<UniformOptions>) {
            this.type = "float";
            Object.assign(this, e);

            this.typeFn =
              {
                float: "1f",
                int: "1i",
                vec2: "2fv",
                vec3: "3fv",
                vec4: "4fv",
                mat4: "Matrix4fv",
              }[this.type] || "1f";

            this.update();
          }

          update(value?: WebGLUniformLocation): void {
            if (this.value !== undefined) {
              const isMatrix = this.typeFn.indexOf("Matrix") === 0;
              const valueToPass = isMatrix ? this.transpose : this.value;
              const valueForMatrix = isMatrix ? this.value : null;
              (context as any)[`uniform${this.typeFn}`](
                value,
                valueToPass,
                valueForMatrix
              );
            }
          }

          // e - name
          // t - type
          // n - length
          getDeclaration(name: string, type: string, length = 0): string {
            if (this.excludeFrom !== type) {
              if (this.type === "array") {
                return (
                  this.value[0].getDeclaration(name, type, this.value.length) +
                  `\nconst int ${name}_length = ${this.value.length};`
                );
              }

              if (this.type === "struct") {
                let name_no_prefix = name.replace("u_", "");
                name_no_prefix =
                  name_no_prefix.charAt(0).toUpperCase() +
                  name_no_prefix.slice(1);

                return (
                  `uniform struct ${name_no_prefix} 
                      {\n` +
                  Object.entries(this.value)
                    .map(([name, uniform]) =>
                      (uniform as Uniform)
                        .getDeclaration(name, type)
                        .replace(/^uniform/, "")
                    )
                    .join("") +
                  `\n} ${name}${length > 0 ? `[${length}]` : ""};`
                );
              }

              return `uniform ${this.type} ${name}${
                length > 0 ? `[${length}]` : ""
              };`;
            }

            return "";
          }
        },
      },
      PlaneGeometry: {
        enumerable: false,
        value: class PlaneGeometry {
          attributes: {
            position: Attribute;
            uv: Attribute;
            uvNorm: Attribute;
            index: Attribute;
          };
          xSegCount: number;
          ySegCount: number;
          vertexCount: number;
          quadCount: number;
          width: number;
          height: number;
          orientation: string;

          constructor(
            width: number,
            height: number,
            n: number,
            i: number,
            orientation: string
          ) {
            context.createBuffer();

            this.attributes = {
              position: new (_miniGl as any).Attribute({
                target: context.ARRAY_BUFFER,
                size: 3,
              }),
              uv: new (_miniGl as any).Attribute({
                target: context.ARRAY_BUFFER,
                size: 2,
              }),
              uvNorm: new (_miniGl as any).Attribute({
                target: context.ARRAY_BUFFER,
                size: 2,
              }),
              index: new (_miniGl as any).Attribute({
                target: context.ELEMENT_ARRAY_BUFFER,
                size: 3,
                type: context.UNSIGNED_SHORT,
              }),
            };

            this.setTopology(n, i);
            this.setSize(width, height, orientation);
          }

          setTopology(e = 1, t = 1): void {
            this.xSegCount = e;
            this.ySegCount = t;
            this.vertexCount = (this.xSegCount + 1) * (this.ySegCount + 1);
            this.quadCount = this.xSegCount * this.ySegCount * 2;
            this.attributes.uv.values = new Float32Array(2 * this.vertexCount);
            this.attributes.uvNorm.values = new Float32Array(
              2 * this.vertexCount
            );
            this.attributes.index.values = new Uint16Array(3 * this.quadCount);

            for (let e = 0; e <= this.ySegCount; e++) {
              for (let t = 0; t <= this.xSegCount; t++) {
                const i = e * (this.xSegCount + 1) + t;

                this.attributes.uv.values[2 * i] = t / this.xSegCount;
                this.attributes.uv.values[2 * i + 1] = 1 - e / this.ySegCount;
                this.attributes.uvNorm.values[2 * i] =
                  (t / this.xSegCount) * 2 - 1;
                this.attributes.uvNorm.values[2 * i + 1] =
                  1 - (e / this.ySegCount) * 2;

                if (t < this.xSegCount && e < this.ySegCount) {
                  const s = e * this.xSegCount + t;

                  this.attributes.index.values[6 * s] = i;
                  this.attributes.index.values[6 * s + 1] =
                    i + 1 + this.xSegCount;
                  this.attributes.index.values[6 * s + 2] = i + 1;
                  this.attributes.index.values[6 * s + 3] = i + 1;
                  this.attributes.index.values[6 * s + 4] =
                    i + 1 + this.xSegCount;
                  this.attributes.index.values[6 * s + 5] =
                    i + 2 + this.xSegCount;
                }
              }
            }

            this.attributes.uv.update();
            this.attributes.uvNorm.update();
            this.attributes.index.update();

            _miniGl.debug("Geometry.setTopology", {
              uv: this.attributes.uv,
              uvNorm: this.attributes.uvNorm,
              index: this.attributes.index,
            });
          }

          setSize(width = 1, height = 1, orientation = "xz"): void {
            this.width = width;
            this.height = height;
            this.orientation = orientation;

            if (
              !this.attributes.position.values ||
              this.attributes.position.values.length !== 3 * this.vertexCount
            ) {
              this.attributes.position.values = new Float32Array(
                3 * this.vertexCount
              );
            }

            const o = width / -2;
            const r = height / -2;
            const segment_width = width / this.xSegCount;
            const segment_height = height / this.ySegCount;

            for (let yIndex = 0; yIndex <= this.ySegCount; yIndex++) {
              const t = r + yIndex * segment_height;

              for (let xIndex = 0; xIndex <= this.xSegCount; xIndex++) {
                const r = o + xIndex * segment_width;
                const l = yIndex * (this.xSegCount + 1) + xIndex;

                this.attributes.position.values[
                  3 * l + "xyz".indexOf(orientation[0])
                ] = r;
                this.attributes.position.values[
                  3 * l + "xyz".indexOf(orientation[1])
                ] = -t;
              }
            }

            this.attributes.position.update();

            _miniGl.debug("Geometry.setSize", {
              position: this.attributes.position,
            });
          }
        },
      },
      Mesh: {
        enumerable: false,
        value: class Mesh {
          geometry: PlaneGeometry;
          material: Material;
          wireframe: boolean;
          attributeInstances: { attribute: Attribute; location: number }[];

          constructor(geometry: PlaneGeometry, material: Material) {
            this.geometry = geometry;
            this.material = material;
            this.wireframe = false;
            this.attributeInstances = [];

            Object.entries(this.geometry.attributes).forEach(
              ([e, attribute]) => {
                this.attributeInstances.push({
                  attribute: attribute as Attribute,
                  location: attribute.attach(e, this.material.program),
                });
              }
            );

            _miniGl.meshes.push(this);

            _miniGl.debug("Mesh.constructor", {
              mesh: this,
            });
          }

          draw(): void {
            context.useProgram(this.material.program);

            this.material.uniformInstances.forEach(
              ({ uniform: e, location: t }) => e.update(t)
            );

            this.attributeInstances.forEach(({ attribute: e, location: t }) =>
              e.use(t)
            );

            context.drawElements(
              this.wireframe ? context.LINES : context.TRIANGLES,
              this.geometry.attributes.index.values.length,
              context.UNSIGNED_SHORT,
              0
            );
          }

          remove(): void {
            _miniGl.meshes = _miniGl.meshes.filter((e) => e != this);
          }
        },
      },
      Attribute: {
        enumerable: false,
        value: class Attribute {
          type: number;
          normalized: boolean;
          buffer: WebGLBuffer;
          target: number;
          size: number;
          values: Float32Array | Uint16Array;

          constructor(e: AttributeOptions) {
            this.type = context.FLOAT;
            this.normalized = false;
            this.buffer = context.createBuffer() as WebGLBuffer;

            Object.assign(this, e);

            this.update();
          }

          update(): void {
            if (this.values !== undefined) {
              context.bindBuffer(this.target, this.buffer);
              context.bufferData(this.target, this.values, context.STATIC_DRAW);
            }
          }

          attach(e: string, t: WebGLProgram): number {
            const n = context.getAttribLocation(t, e);

            if (this.target === context.ARRAY_BUFFER) {
              context.enableVertexAttribArray(n);
              context.vertexAttribPointer(
                n,
                this.size,
                this.type,
                this.normalized,
                0,
                0
              );
            }

            return n;
          }

          use(e: number): void {
            context.bindBuffer(this.target, this.buffer);

            if (this.target === context.ARRAY_BUFFER) {
              context.enableVertexAttribArray(e);
              context.vertexAttribPointer(
                e,
                this.size,
                this.type,
                this.normalized,
                0,
                0
              );
            }
          }
        },
      },
    });

    const a = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    _miniGl.commonUniforms = {
      projectionMatrix: new (_miniGl as any).Uniform({
        type: "mat4",
        value: a,
      }),
      modelViewMatrix: new (_miniGl as any).Uniform({
        type: "mat4",
        value: a,
      }),
      resolution: new (_miniGl as any).Uniform({
        type: "vec2",
        value: [1, 1],
      }),
      aspectRatio: new (_miniGl as any).Uniform({
        type: "float",
        value: 1,
      }),
    };
  }

  setSize(e = 640, t = 480): void {
    this.width = e;
    this.height = t;
    this.canvas.width = e;
    this.canvas.height = t;
    this.gl.viewport(0, 0, e, t);
    this.commonUniforms.resolution.value = [e, t];
    this.commonUniforms.aspectRatio.value = e / t;

    this.debug("MiniGL.setSize", {
      width: e,
      height: t,
    });
  }

  // left, right, top, bottom, near, far
  setOrthographicCamera(e = 0, t = 0, n = 0, i = -2000, s = 2000): void {
    this.commonUniforms.projectionMatrix.value = [
      2 / this.width,
      0,
      0,
      0,
      0,
      2 / this.height,
      0,
      0,
      0,
      0,
      2 / (i - s),
      0,
      e,
      t,
      n,
      1,
    ];

    this.debug(
      "setOrthographicCamera",
      this.commonUniforms.projectionMatrix.value
    );
  }

  render(): void {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clearDepth(1);
    this.meshes.forEach((e) => e.draw());
  }
}

// Sets initial properties
function setProperty<T, K extends keyof T>(
  object: T,
  propertyName: K,
  val: T[K]
): T {
  return Object.defineProperty(object, propertyName, {
    value: val,
    enumerable: true,
    configurable: true,
    writable: true,
  });
}

// Gradient object
class Gradient {
  el: HTMLElement | null;
  cssVarRetries: number;
  maxCssVarRetries: number;
  angle: number;
  isLoadedClass: boolean;
  isScrolling: boolean;
  isStatic: boolean;
  scrollingTimeout: number | undefined;
  scrollingRefreshDelay: number;
  isIntersecting: boolean;
  shaderFiles: {
    vertex: string;
    noise: string;
    blend: string;
    fragment: string;
  };
  vertexShader: string;
  sectionColors: [number, number, number][];
  computedCanvasStyle: CSSStyleDeclaration | null;
  conf: GradientConf;
  uniforms: Record<string, Uniform>;
  t: number;
  last: number;
  width: number;
  minWidth: number;
  height: number;
  xSegCount: number;
  ySegCount: number;
  mesh: Mesh;
  material: Material;
  geometry: PlaneGeometry;
  minigl: MiniGl;
  scrollObserver: any;
  amp: number;
  seed: number;
  freqX: number;
  freqY: number;
  freqDelta: number;
  activeColors: number[];
  isMetaKey: boolean;
  isGradientLegendVisible: boolean;
  isMouseDown: boolean;

  constructor() {
    this.el = null;
    this.cssVarRetries = 0;
    this.maxCssVarRetries = 200;
    this.angle = 0;
    this.isLoadedClass = false;
    this.isScrolling = false;
    this.isStatic = false;
    this.scrollingRefreshDelay = 200;
    this.isIntersecting = false;
    this.shaderFiles = {
      vertex: "",
      noise: "",
      blend: "",
      fragment: "",
    };
    this.vertexShader = "";
    this.sectionColors = [] as [number, number, number][];
    this.computedCanvasStyle = null;
    this.conf = {
      presetName: "",
      wireframe: false,
      density: [0.06, 0.16],
      zoom: 1,
      rotation: 0,
      playing: true,
    };
    this.uniforms = {};
    this.t = 1253106;
    this.last = 0;
    this.width = 0;
    this.minWidth = 1111;
    this.height = 600;
    this.xSegCount = 0;
    this.ySegCount = 0;
    this.mesh = {} as Mesh;
    this.material = {} as Material;
    this.geometry = {} as PlaneGeometry;
    this.minigl = {} as MiniGl;
    this.scrollObserver = null;
    this.amp = 320;
    this.seed = 5;
    this.freqX = 14e-5;
    this.freqY = 29e-5;
    this.freqDelta = 1e-5;
    this.activeColors = [1, 1, 1, 1];
    this.isMetaKey = false;
    this.isGradientLegendVisible = false;
    this.isMouseDown = false;
  }

  handleScroll = (): void => {
    clearTimeout(this.scrollingTimeout);
    this.scrollingTimeout = window.setTimeout(
      this.handleScrollEnd,
      this.scrollingRefreshDelay
    );

    if (this.isGradientLegendVisible) {
      this.hideGradientLegend();
    }

    if (this.conf.playing) {
      this.isScrolling = true;
      this.pause();
    }
  };

  handleScrollEnd = (): void => {
    this.isScrolling = false;

    if (this.isIntersecting) {
      this.play();
    }
  };

  resize = (): void => {
    this.width = window.innerWidth;
    this.minigl.setSize(this.width, this.height);
    this.minigl.setOrthographicCamera();

    this.xSegCount = Math.ceil(this.width * this.conf.density[0]);
    this.ySegCount = Math.ceil(this.height * this.conf.density[1]);

    this.mesh.geometry.setTopology(this.xSegCount, this.ySegCount);
    this.mesh.geometry.setSize(this.width, this.height);

    this.mesh.material.uniforms.u_shadow_power.value = this.width < 600 ? 5 : 6;
  };

  handleMouseDown = (e: MouseEvent): void => {
    if (this.isGradientLegendVisible) {
      this.isMetaKey = e.metaKey;
      this.isMouseDown = true;

      if (this.conf.playing === false) {
        requestAnimationFrame(this.animate);
      }
    }
  };

  handleMouseUp = (): void => {
    this.isMouseDown = false;
  };

  animate = (e: number): void => {
    if (!this.shouldSkipFrame(e) || this.isMouseDown) {
      this.t += Math.min(e - this.last, 1000 / 15);
      this.last = e;

      if (this.isMouseDown) {
        let e = 160;

        if (this.isMetaKey) {
          e = -160;
        }

        this.t += e;
      }

      this.mesh.material.uniforms.u_time.value = this.t;
      this.minigl.render();
    }

    if (this.last !== 0 && this.isStatic) {
      this.minigl.render();
      this.disconnect();
      return;
    }

    if (this.conf.playing || this.isMouseDown) {
      requestAnimationFrame(this.animate);
    }
  };

  addIsLoadedClass = (): void => {
    if (!this.isLoadedClass && this.el) {
      this.isLoadedClass = true;
      this.el.classList.add("isLoaded");

      setTimeout(() => {
        if (this.el && this.el.parentElement) {
          this.el.parentElement.classList.add("isLoaded");
        }
      }, 3000);
    }
  };

  pause = (): void => {
    this.conf.playing = false;
  };

  play = (): void => {
    requestAnimationFrame(this.animate);
    this.conf.playing = true;
  };

  initGradient = (selector: string): Gradient => {
    this.el = document.querySelector(selector);
    this.connect();
    return this;
  };

  async connect(): Promise<void> {
    this.shaderFiles = {
      vertex:
        "varying vec3 v_color;\n\nvoid main() {\n  float time = u_time * u_global.noiseSpeed;\n\n  vec2 noiseCoord = resolution * uvNorm * u_global.noiseFreq;\n\n  vec2 st = 1. - uvNorm.xy;\n\n  //\n  // Tilting the plane\n  //\n\n  // Front-to-back tilt\n  float tilt = resolution.y / 2.0 * uvNorm.y;\n\n  // Left-to-right angle\n  float incline = resolution.x * uvNorm.x / 2.0 * u_vertDeform.incline;\n\n  // Up-down shift to offset incline\n  float offset = resolution.x / 2.0 * u_vertDeform.incline * mix(u_vertDeform.offsetBottom, u_vertDeform.offsetTop, uv.y);\n\n  //\n  // Vertex noise\n  //\n\n  float noise = snoise(vec3(\n    noiseCoord.x * u_vertDeform.noiseFreq.x + time * u_vertDeform.noiseFlow,\n    noiseCoord.y * u_vertDeform.noiseFreq.y,\n    time * u_vertDeform.noiseSpeed + u_vertDeform.noiseSeed\n  )) * u_vertDeform.noiseAmp;\n\n  // Fade noise to zero at edges\n  noise *= 1.0 - pow(abs(uvNorm.y), 2.0);\n\n  // Clamp to 0\n  noise = max(0.0, noise);\n\n  vec3 pos = vec3(\n    position.x,\n    position.y + tilt + incline + noise - offset,\n    position.z\n  );\n\n  //\n  // Vertex color, to be passed to fragment shader\n  //\n\n  if (u_active_colors[0] == 1.) {\n    v_color = u_baseColor;\n  }\n\n  for (int i = 0; i < u_waveLayers_length; i++) {\n    if (u_active_colors[i + 1] == 1.) {\n      WaveLayers layer = u_waveLayers[i];\n\n      float noise = smoothstep(\n        layer.noiseFloor,\n        layer.noiseCeil,\n        snoise(vec3(\n          noiseCoord.x * layer.noiseFreq.x + time * layer.noiseFlow,\n          noiseCoord.y * layer.noiseFreq.y,\n          time * layer.noiseSpeed + layer.noiseSeed\n        )) / 2.0 + 0.5\n      );\n\n      v_color = blendNormal(v_color, layer.color, pow(noise, 4.));\n    }\n  }\n\n  //\n  // Finish\n  //\n\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\n}",
      noise:
        "//\n// Description : Array and textureless GLSL 2D/3D/4D simplex\n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : stegu\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//               https://github.com/stegu/webgl-noise\n//\n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x) {\n    return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat snoise(vec3 v)\n{\n  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n\n// First corner\n  vec3 i  = floor(v + dot(v, C.yyy) );\n  vec3 x0 =   v - i + dot(i, C.xxx) ;\n\n// Other corners\n  vec3 g = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g;\n  vec3 i1 = min( g.xyz, l.zxy );\n  vec3 i2 = max( g.xyz, l.zxy );\n\n  //   x0 = x0 - 0.0 + 0.0 * C.xxx;\n  //   x1 = x0 - i1  + 1.0 * C.xxx;\n  //   x2 = x0 - i2  + 2.0 * C.xxx;\n  //   x3 = x0 - 1.0 + 3.0 * C.xxx;\n  vec3 x1 = x0 - i1 + C.xxx;\n  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\n  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y\n\n// Permutations\n  i = mod289(i);\n  vec4 p = permute( permute( permute(\n            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n          + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))\n          + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n// Gradients: 7x7 points over a square, mapped onto an octahedron.\n// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\n  float n_ = 0.142857142857; // 1.0/7.0\n  vec3  ns = n_ * D.wyz - D.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n  vec4 x = x_ *ns.x + ns.yyyy;\n  vec4 y = y_ *ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4( x.xy, y.xy );\n  vec4 b1 = vec4( x.zw, y.zw );\n\n  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\n  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\n  vec4 s0 = floor(b0)*2.0 + 1.0;\n  vec4 s1 = floor(b1)*2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n  vec3 p0 = vec3(a0.xy,h.x);\n  vec3 p1 = vec3(a0.zw,h.y);\n  vec3 p2 = vec3(a1.xy,h.z);\n  vec3 p3 = vec3(a1.zw,h.w);\n\n//Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n// Mix final noise value\n  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n  m = m * m;\n  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),\n                                dot(p2,x2), dot(p3,x3) ) );\n}",
      blend:
        "//\n// https://github.com/jamieowen/glsl-blend\n//\n\n// Normal\n\nvec3 blendNormal(vec3 base, vec3 blend) {\n\treturn blend;\n}\n\nvec3 blendNormal(vec3 base, vec3 blend, float opacity) {\n\treturn (blendNormal(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Screen\n\nfloat blendScreen(float base, float blend) {\n\treturn 1.0-((1.0-base)*(1.0-blend));\n}\n\nvec3 blendScreen(vec3 base, vec3 blend) {\n\treturn vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));\n}\n\nvec3 blendScreen(vec3 base, vec3 blend, float opacity) {\n\treturn (blendScreen(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Multiply\n\nvec3 blendMultiply(vec3 base, vec3 blend) {\n\treturn base*blend;\n}\n\nvec3 blendMultiply(vec3 base, vec3 blend, float opacity) {\n\treturn (blendMultiply(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Overlay\n\nfloat blendOverlay(float base, float blend) {\n\treturn base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));\n}\n\nvec3 blendOverlay(vec3 base, vec3 blend) {\n\treturn vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));\n}\n\nvec3 blendOverlay(vec3 base, vec3 blend, float opacity) {\n\treturn (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Hard light\n\nvec3 blendHardLight(vec3 base, vec3 blend) {\n\treturn blendOverlay(blend,base);\n}\n\nvec3 blendHardLight(vec3 base, vec3 blend, float opacity) {\n\treturn (blendHardLight(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Soft light\n\nfloat blendSoftLight(float base, float blend) {\n\treturn (blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));\n}\n\nvec3 blendSoftLight(vec3 base, vec3 blend) {\n\treturn vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));\n}\n\nvec3 blendSoftLight(vec3 base, vec3 blend, float opacity) {\n\treturn (blendSoftLight(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Color dodge\n\nfloat blendColorDodge(float base, float blend) {\n\treturn (blend==1.0)?blend:min(base/(1.0-blend),1.0);\n}\n\nvec3 blendColorDodge(vec3 base, vec3 blend) {\n\treturn vec3(blendColorDodge(base.r,blend.r),blendColorDodge(base.g,blend.g),blendColorDodge(base.b,blend.b));\n}\n\nvec3 blendColorDodge(vec3 base, vec3 blend, float opacity) {\n\treturn (blendColorDodge(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Color burn\n\nfloat blendColorBurn(float base, float blend) {\n\treturn (blend==0.0)?blend:max((1.0-((1.0-base)/blend)),0.0);\n}\n\nvec3 blendColorBurn(vec3 base, vec3 blend) {\n\treturn vec3(blendColorBurn(base.r,blend.r),blendColorBurn(base.g,blend.g),blendColorBurn(base.b,blend.b));\n}\n\nvec3 blendColorBurn(vec3 base, vec3 blend, float opacity) {\n\treturn (blendColorBurn(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Vivid Light\n\nfloat blendVividLight(float base, float blend) {\n\treturn (blend<0.5)?blendColorBurn(base,(2.0*blend)):blendColorDodge(base,(2.0*(blend-0.5)));\n}\n\nvec3 blendVividLight(vec3 base, vec3 blend) {\n\treturn vec3(blendVividLight(base.r,blend.r),blendVividLight(base.g,blend.g),blendVividLight(base.b,blend.b));\n}\n\nvec3 blendVividLight(vec3 base, vec3 blend, float opacity) {\n\treturn (blendVividLight(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Lighten\n\nfloat blendLighten(float base, float blend) {\n\treturn max(blend,base);\n}\n\nvec3 blendLighten(vec3 base, vec3 blend) {\n\treturn vec3(blendLighten(base.r,blend.r),blendLighten(base.g,blend.g),blendLighten(base.b,blend.b));\n}\n\nvec3 blendLighten(vec3 base, vec3 blend, float opacity) {\n\treturn (blendLighten(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Linear burn\n\nfloat blendLinearBurn(float base, float blend) {\n\t// Note : Same implementation as BlendSubtractf\n\treturn max(base+blend-1.0,0.0);\n}\n\nvec3 blendLinearBurn(vec3 base, vec3 blend) {\n\t// Note : Same implementation as BlendSubtract\n\treturn max(base+blend-vec3(1.0),vec3(0.0));\n}\n\nvec3 blendLinearBurn(vec3 base, vec3 blend, float opacity) {\n\treturn (blendLinearBurn(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Linear dodge\n\nfloat blendLinearDodge(float base, float blend) {\n\t// Note : Same implementation as BlendAddf\n\treturn min(base+blend,1.0);\n}\n\nvec3 blendLinearDodge(vec3 base, vec3 blend) {\n\t// Note : Same implementation as BlendAdd\n\treturn min(base+blend,vec3(1.0));\n}\n\nvec3 blendLinearDodge(vec3 base, vec3 blend, float opacity) {\n\treturn (blendLinearDodge(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Linear light\n\nfloat blendLinearLight(float base, float blend) {\n\treturn blend<0.5?blendLinearBurn(base,(2.0*blend)):blendLinearDodge(base,(2.0*(blend-0.5)));\n}\n\nvec3 blendLinearLight(vec3 base, vec3 blend) {\n\treturn vec3(blendLinearLight(base.r,blend.r),blendLinearLight(base.g,blend.g),blendLinearLight(base.b,blend.b));\n}\n\nvec3 blendLinearLight(vec3 base, vec3 blend, float opacity) {\n\treturn (blendLinearLight(base, blend) * opacity + base * (1.0 - opacity));\n}",
      fragment:
        "varying vec3 v_color;\n\nvoid main() {\n  vec3 color = v_color;\n  if (u_darken_top == 1.0) {\n    vec2 st = gl_FragCoord.xy/resolution.xy;\n    color.g -= pow(st.y + sin(-12.0) * st.x, u_shadow_power) * 0.4;\n  }\n  gl_FragColor = vec4(color, 1.0);\n}",
    };

    this.conf = {
      presetName: "",
      wireframe: false,
      density: [0.06, 0.16],
      zoom: 1,
      rotation: 0,
      playing: true,
    };

    if (document.querySelectorAll("canvas").length < 1) {
      console.log("DID NOT LOAD HERO ULIBERO CANVAS");
    } else {
      this.minigl = new MiniGl(
        this.el as HTMLCanvasElement,
        null as unknown as number,
        null as unknown as number,
        true
      );

      requestAnimationFrame(() => {
        if (this.el) {
          this.computedCanvasStyle = getComputedStyle(this.el);
          this.waitForCssVars();
        }
      });

      // (this.scrollObserver = await s.create(0.1, !1)),
      //   this.scrollObserver.observe(this.el),
      //   this.scrollObserver.onSeparate(() => {
      //     window.removeEventListener("scroll", this.handleScroll),
      //       window.removeEventListener("mousedown", this.handleMouseDown),
      //       window.removeEventListener("mouseup", this.handleMouseUp),
      //       window.removeEventListener("keydown", this.handleKeyDown),
      //       (this.isIntersecting = !1),
      //       this.conf.playing && this.pause();
      //   }),
      //   this.scrollObserver.onIntersect(() => {
      //     window.addEventListener("scroll", this.handleScroll),
      //       window.addEventListener("mousedown", this.handleMouseDown),
      //       window.addEventListener("mouseup", this.handleMouseUp),
      //       window.addEventListener("keydown", this.handleKeyDown),
      //       (this.isIntersecting = !0),
      //       this.addIsLoadedClass(),
      //       this.play();
      //   });
    }
  }

  disconnect(): void {
    if (this.scrollObserver) {
      window.removeEventListener("scroll", this.handleScroll);
      window.removeEventListener("mousedown", this.handleMouseDown);
      window.removeEventListener("mouseup", this.handleMouseUp);
      window.removeEventListener(
        "keydown",
        this.handleKeyDown as unknown as EventListener
      );
      this.scrollObserver.disconnect();
    }

    window.removeEventListener("resize", this.resize);
  }

  initMaterial(): Material {
    this.uniforms = {
      u_time: new (this.minigl as any).Uniform({
        value: 0,
      }),
      u_shadow_power: new (this.minigl as any).Uniform({
        value: 10,
      }),
      u_darken_top: new (this.minigl as any).Uniform({
        value: this.el?.dataset.jsDarkenTop === "" ? 1 : 0,
      }),
      u_active_colors: new (this.minigl as any).Uniform({
        value: this.activeColors,
        type: "vec4",
      }),
      u_global: new (this.minigl as any).Uniform({
        value: {
          noiseFreq: new (this.minigl as any).Uniform({
            value: [this.freqX, this.freqY],
            type: "vec2",
          }),
          noiseSpeed: new (this.minigl as any).Uniform({
            value: 5e-6,
          }),
        },
        type: "struct",
      }),
      u_vertDeform: new (this.minigl as any).Uniform({
        value: {
          incline: new (this.minigl as any).Uniform({
            value: Math.sin(this.angle) / Math.cos(this.angle),
          }),
          offsetTop: new (this.minigl as any).Uniform({
            value: -0.5,
          }),
          offsetBottom: new (this.minigl as any).Uniform({
            value: -0.5,
          }),
          noiseFreq: new (this.minigl as any).Uniform({
            value: [3, 4],
            type: "vec2",
          }),
          noiseAmp: new (this.minigl as any).Uniform({
            value: this.amp,
          }),
          noiseSpeed: new (this.minigl as any).Uniform({
            value: 10,
          }),
          noiseFlow: new (this.minigl as any).Uniform({
            value: 3,
          }),
          noiseSeed: new (this.minigl as any).Uniform({
            value: this.seed,
          }),
        },
        type: "struct",
        excludeFrom: "fragment",
      }),
      u_baseColor: new (this.minigl as any).Uniform({
        value: this.sectionColors[0],
        type: "vec3",
        excludeFrom: "fragment",
      }),
      u_waveLayers: new (this.minigl as any).Uniform({
        value: [],
        excludeFrom: "fragment",
        type: "array",
      }),
    };

    for (let e = 1; e < this.sectionColors.length; e += 1) {
      this.uniforms.u_waveLayers.value.push(
        new (this.minigl as any).Uniform({
          value: {
            color: new (this.minigl as any).Uniform({
              value: this.sectionColors[e],
              type: "vec3",
            }),
            noiseFreq: new (this.minigl as any).Uniform({
              value: [
                2 + e / this.sectionColors.length,
                3 + e / this.sectionColors.length,
              ],
              type: "vec2",
            }),
            noiseSpeed: new (this.minigl as any).Uniform({
              value: 11 + 0.3 * e,
            }),
            noiseFlow: new (this.minigl as any).Uniform({
              value: 6.5 + 0.3 * e,
            }),
            noiseSeed: new (this.minigl as any).Uniform({
              value: this.seed + 10 * e,
            }),
            noiseFloor: new (this.minigl as any).Uniform({
              value: 0.1,
            }),
            noiseCeil: new (this.minigl as any).Uniform({
              value: 0.63 + 0.07 * e,
            }),
          },
          type: "struct",
        })
      );
    }

    this.vertexShader = [
      this.shaderFiles.noise,
      this.shaderFiles.blend,
      this.shaderFiles.vertex,
    ].join("\n\n");

    return new (this.minigl as any).Material(
      this.vertexShader,
      this.shaderFiles.fragment,
      this.uniforms
    );
  }

  initMesh(): void {
    this.material = this.initMaterial();
    this.geometry = new (this.minigl as any).PlaneGeometry(
      this.width,
      this.height,
      this.xSegCount,
      this.ySegCount,
      "xz"
    );
    this.mesh = new (this.minigl as any).Mesh(this.geometry, this.material);
  }

  shouldSkipFrame(e: number): boolean {
    return (
      !!window.document.hidden ||
      !this.conf.playing ||
      Number.parseInt(e.toString(), 10) % 2 === 0 ||
      false
    );
  }

  updateFrequency(e: number): void {
    this.freqX += e;
    this.freqY += e;
  }

  toggleColor(index: number): void {
    this.activeColors[index] = this.activeColors[index] === 0 ? 1 : 0;
  }

  showGradientLegend(): void {
    if (this.width > this.minWidth) {
      this.isGradientLegendVisible = true;
      document.body.classList.add("isGradientLegendVisible");
    }
  }

  hideGradientLegend(): void {
    this.isGradientLegendVisible = false;
    document.body.classList.remove("isGradientLegendVisible");
  }

  init(): void {
    this.initGradientColors();
    this.initMesh();
    this.resize();
    requestAnimationFrame(this.animate);
    window.addEventListener("resize", this.resize);
  }

  /*
   * Waiting for the css variables to become available, usually on page load before we can continue.
   * Using default colors assigned below if no variables have been found after maxCssVarRetries
   */
  waitForCssVars(): void {
    if (
      this.computedCanvasStyle &&
      this.computedCanvasStyle
        .getPropertyValue("--gradient-color-1")
        .indexOf("#") !== -1
    ) {
      this.init();
      this.addIsLoadedClass();
    } else {
      this.cssVarRetries += 1;

      if (this.cssVarRetries > this.maxCssVarRetries) {
        this.sectionColors = [
          [1, 0, 0], // red (16711680)
          [1, 0, 0], // red (16711680)
          [1, 0, 1], // magenta (16711935)
          [0, 1, 0], // green (65280)
          [0, 0, 1], // blue (255)
        ];
        this.init();
        return;
      }

      requestAnimationFrame(() => this.waitForCssVars());
    }
  }

  /*
   * Initializes the four section colors by retrieving them from css variables.
   */
  initGradientColors(): void {
    this.sectionColors = [
      "--gradient-color-1",
      "--gradient-color-2",
      "--gradient-color-3",
      "--gradient-color-4",
    ]
      .map((cssPropertyName) => {
        if (!this.computedCanvasStyle) return null;

        let hex = this.computedCanvasStyle
          .getPropertyValue(cssPropertyName)
          .trim();

        // Check if shorthand hex value was used and double the length so the conversion in normalizeColor will work.
        if (hex.length === 4) {
          const hexTemp = hex
            .substr(1)
            .split("")
            .map((hexTemp) => hexTemp + hexTemp)
            .join("");
          hex = `#${hexTemp}`;
        }

        return hex && `0x${hex.substr(1)}`;
      })
      .filter(Boolean)
      .map((hex) => normalizeColor(Number.parseInt(hex as string, 16)));
  }

  // Event handler type definition
  handleKeyDown(e: KeyboardEvent): void {
    // Implementation would go here
  }
}

export { normalizeColor, MiniGl, Gradient };

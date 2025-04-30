export const TypeScriptCode = "import axios from 'axios';\n\
\n\
interface UpdateRequest {\n\
  updateType: string;\n\
  description: {\n\
    id: string;\n\
    oracleId: string;\n\
    question: string;\n\
    answer: string;\n\
  };\n\
}\n\
\n\
const updateData = async (apiKey: string, authAddress: string, updateRequest: UpdateRequest) => {\n\
  try {\n\
    const response = await axios.post(\n\
      `http://localhost:9001/v1/models/mistral/updateData/?apiKey=${apiKey}`,\n\
      {\n\
        contents: [updateRequest],\n\
      },\n\
    );\n\
\n\
    if (response.data.success === false) {\n\
      console.log('Error updating data:', response.data.error);\n\
      return response.data.error;\n\
    }\n\
    console.log('Response:', response.data.results);\n\
    return response.data.results;\n\
  } catch (error) {\n\
    console.error('Error updating data:', error);\n\
  }\n\
};\n\
\n\
// Example usage\n\
const apiKey = 'yRAuH0Vb3PLrKk2l58AsdstNLZ58YD'; // Replace with your actual API key\n\
const authAddress = '0x00000000000000000000000000000000000000000'; // Replace with your actual address \n\
const updateRequest: UpdateRequest = {\n\
  updateType: 'question',\n\
  description: {\n\
    id: '1',\n\
    oracleId: '1',\n\
    question: 'What is the capital of France?',\n\
    answer: 'Paris',\n\
  },\n\
};\n\
\n\
updateData(apiKey, authAddress, updateRequest);\n\
"

export const NodeJsCode = "const axios = require('axios');\n\
\n\
const updateData = async (apiKey, authAddress, updateRequest) => {\n\
    try {\n\
        const response = await axios.post(\n\
            `http://localhost:9001/v1/models/mistral/updateData/?apiKey=${apiKey}`,\n\
            {\n\
                contents: [updateRequest],\n\
            },\n\
        );\n\
\n\
    if (response.data.success === false) {\n\
      console.log('Error updating data:', response.data.error);\n\
      return response.data.error;\n\
    }\n\
    console.log('Response:', response.data.results);\n\
    return response.data.results;\n\
    } catch (error) {\n\
        console.error('Error updating data:', error);\n\
    }\n\
}\n\
\n\
/// Example usage\n\
const apiKey = 'yRAuH0Vb3PLrKk2l58AsdstNLZ58YD'; // Replace with your actual API key\n\
const authAddress = '0x00000000000000000000000000000000000000000'; // Replace with your actual address \n\
const updateRequest = {\n\
    updateType: 'question',\n\
    description: {\n\
        id: '1',\n\
        oracleId: '1',\n\
        question: 'What is the capital of France?',\n\
        answer: 'Paris',\n\
    }\n\
}\n\
\n\
updateData(apiKey, authAddress, updateRequest);\n\
"

export const quickstart_guide = `curl "http://localhost:9001/v1/models/mistral/updateData/?apiKey=yRAuH0Vb3PLrKk2l58AsdstNLZ58YD"
-H 'Content-Type: application/json'        
-X POST 
-d '{ 
  "contents": [{
    "updateType": "question" // In addition this to, user can update data of other type,
    "description": // Question Update Case,
        "id": "1",
        "oracleId": "1",
        "question": "What is the capital of France?",
        "answer": "Paris"
        }] 
   }'`;

export const updateFeeds_guide = `curl "http://localhost:9001/get/update_feeds/:questionId"
-H 'Content-Type: application/json'
-X POST
`;
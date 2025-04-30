import LinearProgress from '@mui/material/LinearProgress';
import { purple, green, blue } from '@mui/material/colors';
import Stack from '@mui/material/Stack';

import useContract from 'smartcontract-builder/hooks/contract';
import './index.scss';
import { useMemo } from 'react';

const Loading = () => {
    const { stepId } = useContract();
    const color = useMemo(() => {
        switch (stepId) {
            case 1:
                return blue[400];
            case 2:
                return green[400];
            case 3:
                return purple[400];
            default:
                return purple[400];
        }
    }, [stepId])

    const text = useMemo(() => {
        switch (stepId) {
            case 1:
                return "Generating Contract...";
            case 2:
                return "Reviewing Contract...";
            case 3:
                return "Compiling Contract...";
            default:
                return "Creating Contract...";
        }
    }, [stepId])

    return (
        <div className='loader'>
            <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
                <LinearProgress sx={{
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: color,
                    },
                    marginTop: 20,
                    borderRadius: 5,
                    backgroundColor: (theme) =>
                        theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                }}
                />
            </Stack>
            <h1>{text}</h1>
        </div>
    );
}

export default Loading;
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { blue, green, purple, red } from '@mui/material/colors';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

import { ContractContext } from 'smartcontract-builder/context';
import useContract from 'smartcontract-builder/hooks/contract';
import useWorkflow from 'smartcontract-builder/hooks/workflow';

function LinearDeterminate({ step }: { step: number }) {
    const { state } = useContext(ContractContext) as ContractContextValue;
    const { results, currentContract } = useContract();
    const { workflow } = useWorkflow();
    const [progress, setProgress] = useState(0);

    const resultsLength = useMemo(() => {
        const length = results.findIndex(result => !result.content);
        return length === -1 ? results.length - 1 : length;
    }, [results, currentContract]);

    const color = useMemo(() => {
        if (progress <= 25) return red[400];
        if (progress <= 50) return blue[400];
        if (progress <= 75) return green[400];
        return purple[400];
    }, [progress])

    useEffect(() => {
        if (!workflow || workflow.assistors.length === 0) return;
        if (state.stepId > step) setProgress(100);
        if (state.stepId <= step) setProgress(0);
        if (state.stepId === step && state.isApprove && step !== workflow.assistors.length - 1) {
            const timer = setInterval(() => {
                setProgress((oldProgress) => {
                    const diff = Math.random() * 10;
                    return Math.min(oldProgress + diff, 100);
                });
            }, 500);

            return () => {
                clearInterval(timer);
            };
        }
        if (step === workflow.assistors.length - 1) {
            setProgress(100 / (results.length - 1) * resultsLength);
        }
    }, [state.stepId, state.isApprove, state.chatMode, currentContract]);

    return (
        <Box sx={{ width: '100%', borderRadius: '10px' }}>
            <LinearProgress variant="determinate" value={progress} sx={{
                '& .MuiLinearProgress-bar': {
                    backgroundColor: `${color}`,
                },
                borderRadius: '10px',
                backgroundColor: (theme) =>
                    theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
            }} />
        </Box>
    );
}

export default LinearDeterminate;   
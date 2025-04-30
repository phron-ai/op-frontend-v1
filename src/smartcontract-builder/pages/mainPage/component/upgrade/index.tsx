import {
    CardContent,
    CardHeader,
    Typography,
    Dialog,
    Button,
    Card,
    Grid,
    Box
} from '@mui/material';
import { WorkspacePremium, Rocket, Star } from '@mui/icons-material';

import useCost from 'smartcontract-builder/hooks/cost';
import './index.scss';

const Plan = ({ title, price, features, icon, recommended, id }: any) => {
    const { subscribeToken } = useCost();

    return (
        <Card
            className={`upgrade-plan ${recommended ? 'recommended' : ''}`}
            raised={recommended}
        >
            <CardHeader
                className="plan-header"
                title={
                    <Box sx={{ textAlign: 'center', position: 'relative' }}>
                        {icon}
                        <Typography variant="h5">{title}</Typography>
                        {recommended && <div className="recommended-badge">Recommended</div>}
                    </Box>
                }
            />
            <CardContent>
                <Box className="plan-price">
                    <Typography variant="h4">{price}</Typography>
                    <Typography variant="subtitle1" color="text.secondary">/month</Typography>
                </Box>
                <ul className="feature-list">
                    {features.map((feature: string, index: number) => (
                        <li key={index}>{feature}</li>
                    ))}
                </ul>
                <Button
                    variant={recommended ? 'contained' : 'outlined'}
                    onClick={() => subscribeToken(id)}
                    fullWidth
                >
                    Choose Plan
                </Button>
            </CardContent>
        </Card>
    );
}

const UpgradeModal = ({ visible, onClose }: any) => {
    const plans = [
        {
            title: 'Basic',
            price: '$9.99',
            icon: <Star className="plan-icon" />,
            features: [
                'Up to 5 smart contracts',
                'Basic templates',
                'Email support',
                'Basic analytics'
            ],
            id: 1
        },
        {
            title: 'Pro',
            price: '$24.99',
            icon: <WorkspacePremium className="plan-icon" />,
            recommended: true,
            features: [
                'Unlimited smart contracts',
                'Advanced templates',
                'Priority support',
                'Advanced analytics',
                'Custom branding'
            ],
            id: 2
        },
        {
            title: 'Enterprise',
            price: '$99.99',
            icon: <Rocket className="plan-icon" />,
            features: [
                'Everything in Pro',
                'Dedicated support',
                'Custom development',
                'SLA guarantee',
                'Team collaboration'
            ],
            id: 3
        }
    ];

    return (
        <Dialog
            open={visible}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            className="upgrade-modal"
        >
            <Box sx={{ p: 4 }}>
                <Box className="modal-header">
                    <Typography variant="h3">Upgrade Your Plan</Typography>
                    <Typography variant="subtitle1">Choose the perfect plan for your needs</Typography>
                </Box>
                <Grid container spacing={3} justifyContent="center">
                    {plans.map((plan, index) => (
                        <Grid item key={index} xs={12} md={4}>
                            <Plan {...plan} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Dialog>
    );
};

export default UpgradeModal;
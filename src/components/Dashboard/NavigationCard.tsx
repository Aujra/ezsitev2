import React from 'react';
import { Card, CardContent, Typography, Icon, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

interface NavigationCardProps {
  title: string;
  description: string;
  icon: string;
  path: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const NavigationCard: React.FC<NavigationCardProps> = ({
  title,
  description,
  icon,
  path,
}) => {
  const navigate = useNavigate();

  return (
    <StyledCard>
      <CardActionArea onClick={() => navigate(path)} sx={{ height: '100%' }}>
        <CardContent sx={{ textAlign: 'center', p: 3 }}>
          <Icon sx={{ fontSize: 40, mb: 2 }}>{icon}</Icon>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </StyledCard>
  );
};

export default NavigationCard;

import { Icon } from '@iconify/react';
import appleFilled from '@iconify/icons-eva/checkmark-circle-2-outline';
// material
import { alpha, experimentalStyled as styled } from '@material-ui/core/styles';
import { Card, Typography,Link } from '@material-ui/core';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// utils
import { fShortenNumber } from '../../utils/formatNumber';
// ----------------------------------------------------------------------


const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.lighter
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
    theme.palette.info.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

export default function AppPedido_finalizado(props) {

  return (
    <Link to="/admin/pedido/pedido_finalizado" style={{ textDecoration: 'none',cursor:'pointer' }}  component={RouterLink}>
        <RootStyle>
        <IconWrapperStyle>
            <Icon icon={appleFilled} width={50} height={50} />
        </IconWrapperStyle>
        <Typography variant="h3"></Typography>
        <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
            PEDIDOS FINALIZADOS 
        </Typography>
        </RootStyle>
    </Link>
   
  );
}

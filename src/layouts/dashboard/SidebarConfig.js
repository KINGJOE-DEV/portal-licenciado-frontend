import { Icon } from '@iconify/react';
import dashboard from '@iconify/icons-eva/pie-chart-outline';
import novo from '@iconify/icons-eva/download-outline';
import aprovado from '@iconify/icons-eva/scissors-outline';
import cancelado from '@iconify/icons-eva/slash-outline';
import finalizado from '@iconify/icons-eva/checkmark-circle-2-outline';
import tabela_cores from '@iconify/icons-eva/color-palette-outline';
import perfil from '@iconify/icons-eva/settings-outline';
import pagamento from '@iconify/icons-eva/credit-card-outline';
import devolvido from '@iconify/icons-eva/swap-outline';
import cliente from '@iconify/icons-eva/people-outline';



const getIcon = (name) => <Icon icon={name} width={24} height={24} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/admin/app',
    icon: getIcon(dashboard)
  },

  {
    title: 'Pedido Novo',
    path: '/admin/pedido/pedido_novo',
    icon: getIcon(novo)
  },

  {
    title: 'Pedido Aprovado',
    path: '/admin/pedido/pedido_aprovado',
    icon: getIcon(aprovado)
  },



  {
    title: 'Pedido Finalizado',
    path: '/admin/pedido/pedido_finalizado',
    icon: getIcon(finalizado)
  },

  {
    title: 'Pedido Cancelado',
    path: '/admin/pedido/pedido_cancelado',
    icon: getIcon(cancelado)
  },

  {
    title: 'Pedido Devolvido',
    path: '/admin/pedido/pedido_devolvido',
    icon: getIcon(devolvido)
  },



  {
    path: '',

  },


  {
    title: 'Perfil',
    path: '/admin/perfil',
    icon: getIcon(perfil)
  },
  {
    title: 'Clientes',
    path: '/admin/cliente',
    icon: getIcon(cliente)
  },






];

export default sidebarConfig;

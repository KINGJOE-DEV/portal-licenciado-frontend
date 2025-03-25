import { Routes, Route } from "react-router-dom";
// layouts
import DashboardLayout from './layouts/dashboard';
import Login from './pages/autenticacao/Login';
import DashboardApp from './pages/DashboardApp';
import NotFound from './pages/Page404';

import React, { useContext, useEffect } from 'react';

//PEDIDOS
import Pedido_novo from './pages/pedido/novo/pedido_novo';
import Pedido_novo_item from './pages/pedido/novo/pedido_novo_item';

import Pedido_aprovado from './pages/pedido/aprovado/pedido_aprovado';
import Pedido_aprovado_item from './pages/pedido/aprovado/pedido_aprovado_item';

import Pedido_cancelado from './pages/pedido/cancelado/pedido_cancelado';
import Pedido_cancelado_item from './pages/pedido/cancelado/pedido_cancelado_item';

import Pedido_finalizado from './pages/pedido/finalizado/pedido_finalizar';
import Pedido_finalizado_item from './pages/pedido/finalizado/pedido_finalizar_item';

import Pedido_devolvido from './pages/pedido/devolvido/pedido_devolvido';
import Pedido_devolvido_item from './pages/pedido/devolvido/pedido_devolvido_item';

import Perfil from './pages/perfil/perfil';

import Cliente from './pages/cliente/cliente';
import Cliente_detalhe from './pages/cliente/cliente_detalhe';
import { useCookies } from 'react-cookie';



// ----------------------------------------------------------------------

export default function Router(props) {

  const [autenticado]   = useCookies(['autenticado']);
  console.log('passou no contexto ')
  console.log(autenticado.autenticado)

  return(

    autenticado.autenticado == 'true' ?
         <Routes>
            <Route path="/" element={<Login/>} />   
            <Route path="/login" element={<Login/>} />   
            <DashboardLayout>
                { /* ROTAS AUTENTICADA */ }
                <Route path="/admin/app" element={<DashboardApp/>}   />
                <Route path="/admin/perfil" element={<Perfil/>} />
                <Route path="/admin/cliente" element={<Cliente/>} />
                <Route path="/admin/cliente_detalhe/:cliente_atacado" element={<Cliente_detalhe/>} />
                <Route path="/admin/pedido/pedido_novo" element={<Pedido_novo/>} />
                <Route path="/admin/pedido/pedido_novo_item/:pedido" element={<Pedido_novo_item/>} />
                <Route path="/admin/pedido/pedido_aprovado" element={<Pedido_aprovado/>} />
                <Route path="/admin/pedido/pedido_aprovado_item/:pedido" element={<Pedido_aprovado_item/>} />
                <Route path="/admin/pedido/pedido_cancelado" element={<Pedido_cancelado/>} />
                <Route path="/admin/pedido/pedido_cancelado_item/:pedido" element={<Pedido_cancelado_item/>} />
                <Route path="/admin/pedido/pedido_finalizado" element={<Pedido_finalizado/>} />
                <Route path="/admin/pedido/pedido_finalizado_item/:pedido/:numeroNota" element={<Pedido_finalizado_item/>} />
                <Route path="/admin/pedido/pedido_devolvido" element={<Pedido_devolvido/>} />
                <Route path="/admin/pedido/pedido_devolvido_item/:numeroNota" element={<Pedido_devolvido_item/>} />   
             </DashboardLayout>         
          </Routes>
    :
          <Routes>
              { /* ROTAS SEM AUTENTICADAS */ }
              <Route path="/" element={<Login/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="*" element={<NotFound/>} />
          </Routes>

  )


}

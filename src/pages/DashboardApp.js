// material
import { Box, Grid, Container, Typography } from '@material-ui/core';
// components
import Page from '../components/Page';


import  AppPedido_novo        from '../components/dashboard/AppPedido_novo';
import  AppPedido_aprovado    from '../components/dashboard/AppPedido_aprovado';
import  AppPedido_cancelado   from '../components/dashboard/AppPedido_cancelado';
import AppPedido_finalizado   from '../components/dashboard/AppPedido_finalizado';
import AppPedido_devolvido    from '../components/dashboard/AppPedido_devolvido';

import AppPedidosGrafico from '../components/dashboard/graficos/AppPedidosGrafico';

import axios from 'axios';
import React, {useState,useEffect,useContext } from 'react';
import { AuthContext } from '../content/contentGeral';
import Skeleton from '@material-ui/lab/Skeleton';

export default function App() {

  const { token } = useContext(AuthContext);
  const [produto_leitura, setProduto_leitura] = useState(false);

   /*
  useEffect(() => {
    buscarProdutos()
  },[])
 
 
   async function buscarProdutos() {
        //BUSCAR PRODUTOS NA API

        const { REACT_APP_API } = process.env;
        console.log(REACT_APP_API)

        await  axios({
            method: 'GET',
            url: REACT_APP_API+'/parcerio/dashboard',
            headers: {
                'token': token
            }
              
        }).then(async function (response) {
            
            console.log(response.data[0])
            setProduto_leitura(response.data[0])
   
        }).catch(function (error) {
            console.log(error);
        });
   }
*/



  return (
    <Page title="KING&JOE-PARCEIROS">
      <Container maxWidth="xl">

        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Dashboard</Typography>
        </Box>

        <Grid container spacing={3}>

          <Grid item xs={12} sm={6} md={2.4}>
              <AppPedido_novo  leitura={produto_leitura} />
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
              <AppPedido_aprovado  leitura={produto_leitura} />
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
              <AppPedido_cancelado leitura={produto_leitura} />
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
              <AppPedido_finalizado leitura={produto_leitura} />
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
              <AppPedido_devolvido leitura={produto_leitura} />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>

            { produto_leitura == false ?
                <Skeleton animation="wave" variant="circle" width={'100%'} height={'100%'} style={{  borderRadius: '5%',backgroundColor:'#F5FFFA' }}/>
                :
                <AppPedidosGrafico  leitura={produto_leitura} />
            }

          </Grid>




        </Grid>
      </Container>
    </Page>
  );
}

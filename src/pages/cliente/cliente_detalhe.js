import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import salvar from '@iconify/icons-eva/save-outline';

import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';

// material
import {
  Link,
  Card,
  Table,
  Stack,
  Avatar,
  CircularProgress,
  Button,
  Alert,
  TextField,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@material-ui/core';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../components/dashboard/user';

import axios from 'axios';
import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../../content/contentGeral';

import { useCookies } from 'react-cookie';

// ----------------------------------------------------------------------

export default function User(props) {

  const cliente_atacado = useParams();
  console.log('cliente_atacado', cliente_atacado)

  const [msg, setMsg] = useState(false);
  const [representante, setRepresentante] = useState('');
  const [razao_social, setRazao_social] = useState('');
  const [email, setEmail] = useState('');



  const [cnpj, setCnpj] = useState('');
  const [inscricao, setInscricao] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [telefone, setTelefone] = useState('');
  const [telefone2, setTelefone2] = useState('');
  const [uf, setUf] = useState('');
  const [ddd, setDdd] = useState('');
  const [ddd2, setDdd2] = useState('');




  const { token, tipo_venda } = useContext(AuthContext);


  const { REACT_APP_API } = process.env;
  console.log(REACT_APP_API)
  const [autenticado]   = useCookies(['autenticado']);

  useEffect(() => {
    buscarProdutos()
  }, [])


  async function buscarProdutos() {
    //BUSCAR PRODUTOS NA API
    setMsg(true)
    await axios({
      method: 'POST',
      url: REACT_APP_API + '/cliente_item',
      headers: {
        'token':  autenticado.token
      },
      data: {
        "cliente_atacado": cliente_atacado.cliente_atacado,
        "tipo_venda":  autenticado.tipo_venda
      }

    }).then(async function (response) {

      if (response.status == 200) {


        setRepresentante(response.data[0].REPRESENTANTE)
        setRazao_social(response.data[0].RAZAO_SOCIAL)

        setCnpj(response.data[0].CGC_CPF)
        setInscricao(response.data[0].RG_IE)
        setEndereco(response.data[0].ENDERECO)
        setNumero(response.data[0].NUMERO)
        setCep(response.data[0].CEP)
        setCidade(response.data[0].CIDADE)
        setBairro(response.data[0].BAIRRO)
        setUf(response.data[0].UF)
        setTelefone(response.data[0].TELEFONE1)
        setTelefone2(response.data[0].TELEFONE2)
        setDdd(response.data[0].DDD1)
        setDdd2(response.data[0].DDD2)
        setEmail(response.data[0].EMAIL_NFE)


        setMsg(false)

      } else {
        setMsg(false)

      }

    }).catch(function (error) {
      console.log(error);
    });
  }



  return (
    <Page title="KING&JOE-PARCEIRO">

      <Container>

        <Stack direction="row" alignItems="center" justifyContent="flex-start" mb={12}>
          <Typography variant="h4" gutterBottom>
            Cliente : {cliente_atacado.cliente_atacado}
          </Typography>
        </Stack>

        {msg ?


          <Stack sx={{ color: 'grey.900' }} spacing={2} direction="row">
            <CircularProgress color="success" />
          </Stack>
          : ''}



        <TextField
          style={{ marginTop: 20, width: '40%', marginLeft: 4 }}
          id="outlined-number"
          label="CLIENTE"
          InputLabelProps={{
            shrink: true,
          }}
          value={cliente_atacado.cliente_atacado}
        />

        <TextField
          style={{ marginTop: 20, width: '40%', marginLeft: 4 }}
          id="outlined-number"
          label="REPRESENTANTE"
          InputLabelProps={{
            shrink: true,
          }}
          value={representante}
        />


        <TextField
          style={{ marginTop: 20, width: '40%', marginLeft: 4 }}
          id="outlined-number"
          label="RAZAO SOCIAL"
          InputLabelProps={{
            shrink: true,
          }}
          value={razao_social}
        />

        <TextField
          style={{ marginTop: 20, width: '40%', marginLeft: 4 }}
          id="outlined-number"
          label="EMAIL"
          InputLabelProps={{
            shrink: true,
          }}
          value={email}
        />


        < TextField
          style={{ marginTop: 20, width: '40%', marginLeft: 4 }}
          id="outlined-number"
          label="CPNJ"
          InputLabelProps={{
            shrink: true,
          }}
          value={cnpj}
        />

        <TextField
          style={{ marginTop: 20, width: '40%', marginLeft: 4 }}
          id="outlined-number"
          label="INSCRIÇÃO ESTADUAL"
          InputLabelProps={{
            shrink: true,
          }}
          value={inscricao}
        />







        <TextField
          style={{ width: '40%', marginTop: 65 }}
          id="outlined-number"
          label="ENDEREÇO"
          InputLabelProps={{
            shrink: true,
          }}
          value={endereco}
        />
        <TextField
          style={{ width: '10%', marginTop: 65, marginLeft: 3 }}
          id="outlined-number"
          label="N°"
          InputLabelProps={{
            shrink: true,
          }}
          value={numero}
        />

        <TextField
          style={{ width: '20%', marginTop: 65, marginLeft: 3 }}
          id="outlined-number"
          label="CEP"
          InputLabelProps={{
            shrink: true,
          }}
          value={cep}
        />

        <TextField
          style={{ marginTop: 20, width: '30%', marginLeft: 3 }}
          id="outlined-number"
          label="CIDADE"

          InputLabelProps={{
            shrink: true,
          }}
          value={cidade}
        //onChange={mudarCampo_1}
        />

        <TextField
          style={{ marginTop: 20, width: '40%', marginLeft: 3 }}
          id="outlined-number"
          label="BAIRRO"
          InputLabelProps={{
            shrink: true,
          }}
          value={bairro}
        />

        <TextField
          style={{ marginTop: 20, width: '10%', marginLeft: 3 }}
          id="outlined-number"
          label="ESTADO"
          InputLabelProps={{
            shrink: true,
          }}
          value={uf}
        />

        <TextField
          style={{ marginTop: 20, width: '30%', marginLeft: 3 }}
          id="outlined-number"
          label="TELEFONE 1"
          InputLabelProps={{
            shrink: true,
          }}
          value={ddd + telefone}

        />

        <TextField
          style={{ marginTop: 20, width: '30%', marginLeft: 3 }}
          id="outlined-number"
          label="TELEFONE 2"
          InputLabelProps={{
            shrink: true,
          }}
          value={ddd2 + telefone2}

        />













      </Container>
    </Page>
  );
}

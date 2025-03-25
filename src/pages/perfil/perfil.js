
import { Icon } from '@iconify/react';
import { useState } from 'react';
import salvar from '@iconify/icons-eva/save-outline';

// material
import {
  Stack,
  Button,
  Alert,
  TextField,
  Container,
  Typography,

} from '@material-ui/core';
// components
import Page from '../../components/Page';

import axios from 'axios';
import React, { useEffect } from 'react';

import { useCookies } from 'react-cookie';
// ----------------------------------------------------------------------


export default function User(props) {

  const [msg, setMsg] = useState(false);
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');

  const { REACT_APP_API } = process.env;
  console.log(REACT_APP_API)

  const [autenticado]   = useCookies(['autenticado']);


  useEffect(() => {
    buscarProdutos()
  }, [])


  async function buscarProdutos() {
    //BUSCAR PRODUTOS NA API

    await axios({
      method: 'POST',
      url: REACT_APP_API + '/parceiro/perfil',
      headers: {
        'token':  autenticado.token
      },
      data: {
        "nome_clifor": autenticado.usuario,

      }

    }).then(async function (response) {

      if (response.status == 200) {

        setNome(response.data[0].NOME_CLIFOR)
        setCnpj(response.data[0].CGC_CPF)
        setEndereco(response.data[0].ENDERECO)
        setCep(response.data[0].CEP)
        setCidade(response.data[0].CIDADE)
        setBairro(response.data[0].BAIRRO)

      } else {
        setMsg(response.data[0])

      }

    }).catch(function (error) {
      console.log(error);
    });
  }


  const alterarSenha = async (event) => {

    setSenha(event.target.value)

  }

  const AlterarSenhabanco = async () => {

    await axios({
      method: 'POST',
      url: REACT_APP_API + '/parceiro/perfil_alterar',
      headers: {
        'token': autenticado.token
      },
      data: {
        "email": autenticado.email,
        "senha": senha,

      }
    }).then(async function (response) {

      if (response.status === 200) {
        console.log(response)

        setMsg('Salva com sucesso !')

      } else {
        setMsg('Erro tente novamente !')

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
            Perfil
          </Typography>
        </Stack>

        {msg ?

          <Alert severity="success"> {msg}</Alert>
          :
          ''
        }

        <Button
          style={{ marginTop: -155, marginLeft: '80%', backgroundColor: 'green', fontSize: 12 }}
          variant="contained"
          startIcon={<Icon icon={salvar} style={{ color: 'white', fontSize: 20 }} />}
          onClick={AlterarSenhabanco}
        >
          ALTERAR SENHA
        </Button>

        <TextField
          style={{ marginTop: 20, width: '60%' }}
          id="outlined-number"
          label="EMAIL"
          disabled
          InputLabelProps={{
            shrink: true,
          }}
          value={autenticado.email}
        //onChange={mudarCampo_1}
        />

        <TextField
          style={{ marginTop: 20, width: '30%', marginLeft: 10 }}
          id="outlined-number"
          label="SENHA"
          autoFocus
          InputLabelProps={{
            shrink: true,
          }}
          value={senha}
          onChange={alterarSenha}
        />



        <TextField
          style={{ marginTop: 20, width: '50%' }}
          id="outlined-number"
          label="NOME"
          disabled

          InputLabelProps={{
            shrink: true,
          }}
          value={nome}
        //onChange={mudarCampo_1}
        />

        <TextField
          style={{ marginTop: 20, width: '40%', marginLeft: 10 }}
          id="outlined-number"
          disabled
          label="CNPJ"
          InputLabelProps={{
            shrink: true,
          }}
          value={cnpj}
        //onChange={mudarCampo_2}
        />


        <TextField
          style={{ marginTop: 20, width: '90%' }}
          id="outlined-number"
          label="ENDEREÇO"
          disabled
          InputLabelProps={{
            shrink: true,
          }}
          value={endereco}
        //onChange={mudarCampo_1}
        />

        <TextField
          style={{ marginTop: 20, width: '30%' }}
          id="outlined-number"
          disabled
          label="CEP"
          InputLabelProps={{
            shrink: true,
          }}
          value={cep}
        //onChange={mudarCampo_2}
        />



        <TextField
          style={{ marginTop: 20, width: '30%', marginLeft: 3 }}
          id="outlined-number"
          label="CIDADE"
          disabled

          InputLabelProps={{
            shrink: true,
          }}
          value={cidade}
        //onChange={mudarCampo_1}
        />

        <TextField
          style={{ marginTop: 20, width: '30%', marginLeft: 3 }}
          id="outlined-number"
          disabled
          label="BAIRRO"
          InputLabelProps={{
            shrink: true,
          }}
          value={bairro}
        //onChange={mudarCampo_2}
        />







      </Container>
    </Page>
  );
}

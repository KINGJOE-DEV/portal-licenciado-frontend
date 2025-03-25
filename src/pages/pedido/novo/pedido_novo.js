import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState } from 'react';

import { CSVLink } from "react-csv";

import aprovado from '@iconify/icons-eva/checkmark-outline';
import download from '@iconify/icons-eva/download-outline';
import { visuallyHidden } from '@material-ui/utils';

import csv from '@iconify/icons-eva/shuffle-2-outline';
import item from '@iconify/icons-eva/external-link-outline';
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
  TableHead,
  TableBody,
  TableCell,
  Container,
  TableSortLabel,
  Box,
  Typography,
  TableContainer,
  TablePagination
} from '@material-ui/core';
// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import { UserListToolbar, UserMoreMenu } from '../../../components/dashboard/user';
import impresao from '@iconify/icons-eva/printer-outline';
import axios from 'axios';
import React, { useEffect, useContext } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PrintButton from '../../../components/print/html_print_pedido';

import moment from 'moment';
import { AuthContext } from '../../../content/contentGeral';
import { useCookies } from 'react-cookie';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'PEDIDO', label: 'Pedido', alignRight: false },
  { id: 'CLIENTE_ATACADO', label: 'Cliente', alignRight: false },
  { id: 'REPRESENTANTE', label: 'Representante', alignRight: false },
  { id: 'TOT_QTDE_ORIGINAL', label: 'QTDE', alignRight: false },
  { id: 'TOT_VALOR_ORIGINAL', label: 'Total', alignRight: false },
  { id: 'RECEBIMENTO', label: 'Recebimento', alignRight: false },
  { id: 'ENTREGA', label: 'Entrega', alignRight: false },
];
// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.PEDIDO.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
// ----------------------------------------------------------------------
export default function User(props) {

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [selecao, setSelecao] = useState('');

  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [resultado, setResultado] = useState([{
    "PEDIDO": ""
  }]);
  const [resultadoImpressao, setResultadoImpressao] = useState([{
    "PEDIDO": ""
  }]);

  const [telefone2, setTelefone2] = useState('');
  const [ddd2, setDdd2] = useState('');

  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [telefone, setTelefone] = useState('');
  const [ddd, setDdd] = useState('');
  const [uf, setUf] = useState('');
  const [inscricao_estadual, setInscricao_estadual] = useState('');

  const [msgCarregar_aprovar, setMsgCarregar_aprovar] = useState(false);
  const [ativarBotao_aprovar, setAtivarBotao_aprovar] = useState(true);
  const [msgInformativo_aprovar, setMsgInformativo_aprovar] = useState(false);
  const [msgResposta_aprovar, setMsgResposta_aprovar] = useState(false);

  const [cliente, setCliente] = useState('');
  const [representante, setRepresentante] = useState('');
  const [razao_social, setRazao_social] = useState('');
  const [email, setEmail] = useState('');


  const [resultado_csv, setResultado_csv] = useState([]);
  const [msgCarregar, setMsgCarregar] = useState(false);
  const [openentregaModal, setopenentregaModal] = useState(false);

  const [opencsvModal, setopencsvModal] = useState(false);

  const { token, tipo_venda, Sair, statusCarregar, setStatusCarregar, usuario } = useContext(AuthContext);
  const [carregarProduto, setCarregarProduto] = useState(true);

  
  const [validarselecao, setValidarselecao] = useState(false);

  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState('lx');
  const [minHeight, setMinHeight] = useState(200);
  const [msg, setMsg] = useState('Insira o periodo de entrega para todos os pedidos que nao possuem entrega');

  const [qtde_total, setQtde_total] = useState(0);
  const [valor_total, setValor_total] = useState(0);

  const [openAprovar, setOpenAprovar] = useState(false);
  const [openclienteModal, setopenclienteModal] = useState(false);
  const [openclienteModal_2, setopenclienteModal_2] = useState(false);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFinal, setDataFinal] = useState('');

  const navigate = useNavigate();

  const { REACT_APP_API } = process.env;
  console.log(REACT_APP_API)

  const [autenticado]   = useCookies(['autenticado']);

  useEffect(() => {
    buscarProdutos()
  }, [])

  async function buscarProdutos() {

    console.log(autenticado.token)
    //BUSCAR PRODUTOS NA API
    await axios({
      method: 'POST',
      url: REACT_APP_API + '/parceiro/pedido_novo',
      headers: {
        'token': autenticado.token
      },
      data: {
        "tipo_venda": autenticado.tipo_venda,
      }
    }).then(async function (response) {
      if (response.status == 200) {

        setCarregarProduto(false)
        setStatusCarregar(false)
        setResultado(await response.data)
        console.log(resultado)

      } else {
        setCarregarProduto(false)
        setResultado([{
          "PEDIDO": null,
          "CLIENTE_ATACADO": "",
          "REPRESENTANTE": "Vazio",
          "TOT_QTDE_ORIGINAL": "",
          "TOT_VALOR_ORIGINAL": "",
          "ENTREGA": ""
        }])
        console.log(resultado)
      }
    }).catch(function (error) {
      setStatusCarregar(false)
      Sair()
      console.log(error);
    });
  }


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };


  //MODAL APROVAR
  const AprovarModal = () => {
      setMsgInformativo_aprovar('Deseja APROVAR os pedidos selecionados ?');
      setMsgResposta_aprovar(false)
      setAtivarBotao_aprovar(true)
      setOpenAprovar(true);
  };
  const AprovarModalFechar = () => {
      setOpenAprovar(false);
  };
  

  async function EntregaModal() {
    setopenentregaModal(true);
  };
  const fecharentregaModal = () => {
    setopenentregaModal(false);
  };



  async function csvModal() {
    setopencsvModal(true);

    setMsgCarregar(true);

    console.log(selected)
    //BUSCAR PRODUTOS NA API
    if (selected != []) {

      await axios({
        method: 'POST',
        url: REACT_APP_API + '/parceiro/exportador_csv',
        headers: {
          'token': autenticado.token
        },
        data: {
          "pedidos": selected,
        }
      }).then(async function (response) {

        if (response.status == 200) {

          setResultado_csv(response.data)
          console.log(response.data)
          setMsgCarregar(false)

        } else {
          setMsgCarregar(false)
          setMsg('Erro tente Novamente !')
          console.log(response)
        }


      }).catch(function (error) {
        console.log(error);
      });

    } else {
      setMsgCarregar(false);
      setopenclienteModal(true);
      setMsg('Selecione algum pedido para exportação')
    }

  };


  const fecharcsvModal = () => {
    setopencsvModal(false);
  };



  const MudarDataInicio = (event) => {
    console.log(event.target.value)
    setDataInicio(event.target.value);
  };
  const MudarDataFinal = (event) => {
    console.log(event.target.value)
    setDataFinal(event.target.value);
  };


  const SelecionarTodos = async (event) => {

    console.log(event.target.checked)
    console.log('*****************************')
    var status = '';

    setDataInicio('');
    setDataFinal('');
    setMsg('');

    if (event.target.checked) {
      const newSelecteds = resultado.map((n) => "'" + n.PEDIDO + "'");
      console.log(newSelecteds)
      setSelected(newSelecteds);
      setValidarselecao(true)
      status = '1';
    } else {
      setSelected([]);
      setValidarselecao(false)
      status = '0';
    }



    console.log(selected)
    setSelecao('todos');
  }


  const SelecionarIndividual = async (event, PEDIDO) => {

    setSelecao('individual');
    setDataInicio('');
    setDataFinal('');
    setMsg('');

    const selectedIndex = selected.indexOf("'" + PEDIDO + "'");
    const id = "'" + PEDIDO + "'";

    let newSelected = [];
    if (selectedIndex === -1) {
      console.log('1')
      setValidarselecao(true)
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      console.log('2')
      setValidarselecao(false)
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      console.log('3')
      setValidarselecao(true)
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      console.log('4')
      setValidarselecao(true)
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);

    console.log(selected)

  };


  async function Imprimir() {

    console.log(selected)
    //BUSCAR PRODUTOS NA API
    if (selected != []) {

      await axios({
        method: 'POST',
        url: REACT_APP_API + '/parceiro/pedido_novo_impressao',
        headers: {
          'token': autenticado.token
        },
        data: {
          "pedidos": selected,
        }
      }).then(async function (response) {
        if (response.status == 200) {


          setResultadoImpressao(await response.data)
          var Qtde_total = 0;
          var Valor_total = 0;

          response.data.forEach(element => {
            Qtde_total = Qtde_total + element.TOT_QTDE_ENTREGAR;
            Valor_total = Valor_total + element.TOT_VALOR_ENTREGAR;
          });

          setQtde_total(Qtde_total)
          setValor_total(Valor_total)

          setopenclienteModal(true);
          console.log(response.data)


        } else {

          setMsg('Erro tente Novamente !')
          setopenclienteModal(true);
          console.log(response)
        }

      }).catch(function (error) {
        console.log(error);
      });

    } else {
      setopenclienteModal(true);
      setMsg('Selecione algum pedido para impressão')
    }


  }


  const fecharclienteModal = () => {
    setopenclienteModal(false);
  };



  const headers = [
    { label: "DATA_RECEBIMENTO", key: "DATA_RECEBIMENTO" },
    { label: "CNPJ", key: "CNPJ" },
    { label: "IE", key: "IE" },
    { label: "CLIENTE", key: "CLIENTE" },
    { label: "DDD", key: "DDD" },
    { label: "TELEFONE", key: "TELEFONE" },
    { label: "CEP", key: "CEP" },
    { label: "NUMERO", key: "NUMERO" },
    { label: "ENDERECO", key: "ENDERECO" },
    { label: "BAIRRO", key: "BAIRRO" },
    { label: "CIDADE", key: "CIDADE" },
    { label: "UF", key: "UF" },
    { label: "REPRESENTANTE", key: "REPRESENTANTE" },
    { label: "PEDIDO", key: "PEDIDO" },
    { label: "PRODUTO", key: "PRODUTO" },
    { label: "COR_PRODUTO", key: "COR_PRODUTO" },
    { label: "DESC_PRODUTO", key: "DESC_PRODUTO" },
    { label: "DESC_COR_PRODUTO", key: "DESC_COR_PRODUTO" },
    { label: "DESC_COND_PGTO", key: "DESC_COND_PGTO" },
    { label: "QTDE_ENTREGAR", key: "QTDE_ENTREGAR" },
    { label: "VALOR_ENTREGAR", key: "VALOR_ENTREGAR" },
    { label: "GRADE", key: "GRADE" },
    { label: "VE1", key: "VE1" },
    { label: "VE2", key: "VE2" },
    { label: "VE3", key: "VE3" },
    { label: "VE4", key: "VE4" },
    { label: "VE5", key: "VE5" },
    { label: "VE6", key: "VE6" },
    { label: "VE7", key: "VE7" },
    { label: "VE8", key: "VE8" },
    { label: "VE9", key: "VE9" },
    { label: "VE10", key: "VE10" },
    { label: "TAMANHO_1", key: "TAMANHO_1" },
    { label: "TAMANHO_2", key: "TAMANHO_2" },
    { label: "TAMANHO_3", key: "TAMANHO_3" },
    { label: "TAMANHO_4", key: "TAMANHO_4" },
    { label: "TAMANHO_5", key: "TAMANHO_5" },
    { label: "TAMANHO_6", key: "TAMANHO_6" },
    { label: "TAMANHO_7", key: "TAMANHO_7" },
    { label: "TAMANHO_8", key: "TAMANHO_8" },
    { label: "TAMANHO_9", key: "TAMANHO_9" },
    { label: "TAMANHO_10", key: "TAMANHO_10" }

  ];




  const ExportarCsv = {
    data: resultado_csv,
    headers: headers,
    filename: 'KINGJOE-PEDIDOS-NOVOS.csv'
  };




  const Aprovar = async () => {

    setMsgCarregar_aprovar(true);
    setAtivarBotao_aprovar(true);

    await axios({
      method: 'POST',
      url: REACT_APP_API + '/parceiro/pedido_novo_item_aprovar_lista',
      headers: {
        'token': autenticado.token
      },
      data: {
        "pedido": selected
      }
    }).then(async function (response) {

      console.log(response)
      setMsgCarregar_aprovar(false);
      setAtivarBotao_aprovar(false);

      if (response.status === 200) {
        
        buscarProdutos();
        setMsgInformativo_aprovar(response.data.msg);

      } else {

        setMsgInformativo_aprovar(response.data.msg);
      }


    }).catch(function (error) {
      console.log(error);
    });

  }





  async function ClienteModal(CLIENTE_ATACADO) {

    setopenclienteModal_2(true);
    setMsgCarregar(true)

    await axios({
      method: 'POST',
      url: REACT_APP_API + '/cliente_item',
      headers: {
        'token': autenticado.token
      },
      data: {
        "cliente_atacado": CLIENTE_ATACADO,
        "tipo_venda": autenticado.tipo_venda,

      }

    }).then(async function (response) {
      if (response.status == 200) {

        console.log(response)

        setCliente(response.data[0].CLIENTE_ATACADO)
        setRepresentante(response.data[0].REPRESENTANTE)
        setRazao_social(response.data[0].RAZAO_SOCIAL)

        setCnpj(response.data[0].CGC_CPF)
        setEndereco(response.data[0].ENDERECO)
        setNumero(response.data[0].NUMERO)
        setCep(response.data[0].CEP)
        setCidade(response.data[0].CIDADE)
        setBairro(response.data[0].BAIRRO)
        setUf(response.data[0].UF)
        setTelefone(response.data[0].TELEFONE1)
        setDdd(response.data[0].DDD1)
        setEmail(response.data[0].EMAIL_NFE)
        setInscricao_estadual(response.data[0].RG_IE)



        setTelefone2(response.data[0].TELEFONE2)
        setDdd2(response.data[0].DDD2)
        setMsgCarregar(false)

      } else {

        console.log(response)
        setMsgCarregar(false)
      }

    }).catch(function (error) {
      Sair()
      console.log(error);
    });


  };

  const fecharclienteModal_2 = () => {
    setopenclienteModal_2(false);
  };






  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - resultado.length) : 0;
  const filteredUsers = applySortFilter(resultado, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="KING&JOE-PARCEIRO">



      <Dialog
        open={openAprovar}
        onClose={AprovarModalFechar}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          ATENÇÃO !
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {
              validarselecao ?
                msgCarregar_aprovar == true ?
                  <Stack sx={{ color: 'grey.900', marginLeft: '30%' }} spacing={2} direction="row">
                    <CircularProgress color="success" />
                  </Stack>
                :
                 <h4>{msgInformativo_aprovar}</h4>
               : 
                'Nenhum pedido selecionado !'
            }
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={AprovarModalFechar}>FECHAR</Button>
          {ativarBotao_aprovar == true ?
            <Button onClick={Aprovar} autoFocus  >
              APROVAR
            </Button>
            :
            ''
          }
        </DialogActions>
      </Dialog>



      <Dialog
        open={opencsvModal}
        onClose={csvModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          EXPORTAÇÃO !
        </DialogTitle>
        <DialogContent>


          {
            validarselecao ?
              msgCarregar == true ?
                <Stack sx={{ color: 'grey.900', marginLeft: 5 }} spacing={2} direction="row">
                  <CircularProgress color="success" />
                </Stack>
                :
                <>
                  <DialogContentText id="alert-dialog-description">
                    Exportar em .csv pedidos selecionados !
                  </DialogContentText>

                  <Button
                    style={{ marginLeft: 80, background: 'blue', marginTop: 20 }}
                    variant="contained"
                    to="#"
                    startIcon={<Icon icon={download} />}

                  >
                    <CSVLink {...ExportarCsv} style={{ color: '#FFF' }}>Download</CSVLink>
                  </Button>

                </>
               : 'Nenhum produto selecionado !'
          }


        </DialogContent>
        <DialogActions>
          <Button onClick={fecharcsvModal}>FECHAR</Button>

        </DialogActions>
      </Dialog>








      <Dialog
        open={openclienteModal_2}
        onClose={fecharclienteModal_2}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={fullWidth}
        maxWidth={maxWidth}
      >
        <DialogTitle id="alert-dialog-title">
          DADOS DO CLIENTE : {cliente}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">

            {
        
                msgCarregar == true ?
                    <Stack sx={{ color: 'grey.900', marginLeft: 5,width:250 }} spacing={2} direction="row">
                    <CircularProgress color="success" />
                  </Stack>
                  :
                  <>
                    <TextField
                      style={{ marginTop: 20, width: '60%' }}
                      id="outlined-number"
                      label="RAZÃO SOCIAL"
                      type="text"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={razao_social}
                    />

                    <TextField
                      style={{ marginTop: 20, width: '30%', marginLeft: 4 }}
                      id="outlined-number"
                      label="EMAIL"
                      type="text"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={email}
                    />

                    <TextField
                      style={{ marginTop: 20, width: '40%', marginLeft: 4 }}
                      id="outlined-number"
                      label="CNPJ"
                      type="text"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={cnpj}
                    />


                    <TextField
                      style={{ marginTop: 20, width: '40%', marginLeft: 4 }}
                      id="outlined-number"
                      label="INSCRICAO ESTADUAL"
                      type="text"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={inscricao_estadual}
                    />

                    <TextField
                      style={{ marginTop: 20, width: '30%', marginLeft: 4 }}
                      id="outlined-number"
                      label="TELEFONE"
                      type="text"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={ddd + telefone}
                    />

                    <TextField
                      style={{ marginTop: 20, width: '30%', marginLeft: 4 }}
                      id="outlined-number"
                      label="TELEFONE 2"
                      type="text"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={ddd2 + telefone2}
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
                </>
        
            }

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharclienteModal_2}>FECHAR</Button>

        </DialogActions>

      </Dialog>


      <Dialog
        open={openclienteModal}
        onClose={fecharclienteModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        minHeight={minHeight}
      >
        <DialogTitle id="alert-dialog-title">
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">

            <PrintButton data={resultadoImpressao} qtde_total={qtde_total} valor_total={valor_total} pedidos={selected} />

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharclienteModal}>FECHAR</Button>
        </DialogActions>
      </Dialog>


      <Container>
        <Stack direction="row" alignItems="center" justifyContent="flex-start" mb={12}>
          <Typography variant="h4" gutterBottom>
            Pedidos Novos


          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="flex-end" mb={12} style={{ marginTop: -90 }}>
 
          <Button
            style={{ marginLeft: 20, background: 'rgb(11, 171, 0)' }}
            variant="contained"
            to="#"
            startIcon={<Icon icon={csv} />}
            onClick={csvModal}
          >
            Exportar Csv
          </Button>

          <Button
            style={{ marginLeft: 20, background: 'blue' }}
            variant="contained"
            to="#"
            startIcon={<Icon icon={impresao} />}
            onClick={Imprimir}
          >
            Imprimir
          </Button>
     
          <Button
            style={{ marginLeft: 20 }}
            variant="contained"
            to="#"
            startIcon={<Icon icon={aprovado} />}
            onClick={AprovarModal}
          >
              Aprovar
          </Button>
                            
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          {statusCarregar ?
            <CircularProgress style={{}} />
            :
            <>
              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>

                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={selected.length > 0 && selected.length < resultado.length}
                            checked={resultado.length > 0 && selected.length === resultado.length}
                            onChange={SelecionarTodos}
                          />
                        </TableCell>
                        {TABLE_HEAD.map((headCell) => (
                          <TableCell
                            key={headCell.id}
                            align={headCell.alignRight ? 'right' : 'left'}
                            sortDirection={orderBy === headCell.id ? order : false}
                          >
                            <TableSortLabel
                              hideSortIcon
                              active={orderBy === headCell.id}
                              direction={orderBy === headCell.id ? order : 'asc'}
                            >
                              {headCell.label}
                              {orderBy === headCell.id ? (
                                <Box sx={{ ...visuallyHidden }}>
                                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                              ) : null}
                            </TableSortLabel>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {carregarProduto == true ?

                        <Stack sx={{ color: 'grey.900', marginLeft: '30%' }} spacing={2} direction="row">
                          <CircularProgress color="success" />
                        </Stack>
                        :

                        filteredUsers
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => {

                            const { PEDIDO, CLIENTE_ATACADO, REPRESENTANTE, TOT_QTDE_ENTREGAR, TOT_VALOR_ENTREGAR, DATA_RECEBIMENTO, LICENCIADO_ENTREGA_LIMITE } = row;
                            const URL = "/admin/pedido/pedido_novo_item/" + PEDIDO
                            var isItemSelected = selected.indexOf("'" + PEDIDO + "'") !== -1;


                            return (
                              <TableRow
                                hover
                                key={"'" + PEDIDO + "'"}
                                tabIndex={-1}
                                role="checkbox"
                                selected={isItemSelected}
                                aria-checked={isItemSelected}
                              >
                                {
                                  PEDIDO != null ?
                                    <TableCell padding="checkbox" >
                                      <Checkbox
                                        checked={isItemSelected}
                                        onChange={(event) => SelecionarIndividual(event, PEDIDO)}
                                      />
                                    </TableCell>
                                    :
                                    ''
                                }


                                <TableCell align="left">{PEDIDO}</TableCell>
                                <TableCell align="left">{CLIENTE_ATACADO}</TableCell>
                                <TableCell align="left">{REPRESENTANTE}</TableCell>
                                <TableCell align="left">{TOT_QTDE_ENTREGAR}</TableCell>
                                <TableCell align="left">{TOT_VALOR_ENTREGAR != null ? 'R$' : ''} {typeof TOT_VALOR_ENTREGAR === 'number' ? TOT_VALOR_ENTREGAR.toFixed(2) : TOT_VALOR_ENTREGAR}</TableCell>
                                <TableCell align="left">
                                  {
                                    DATA_RECEBIMENTO == null ? '' :
                                      moment(DATA_RECEBIMENTO).utc().format('DD/MM/YYYY')
                                  }
                                </TableCell>
                                {
                                  PEDIDO != null ?
                                    LICENCIADO_ENTREGA_LIMITE != null ?
                                      <TableCell align="left">
                                        {moment(LICENCIADO_ENTREGA_LIMITE).utc().format('DD/MM/YYYY')}
                                      </TableCell>
                                      :
                                      <TableCell align="left" style={{ fontSize: 12, color: 'red' }}>
                                        ABERTA
                                      </TableCell>
                                    :
                                    ''
                                }
                                {
                                  PEDIDO != null ?
                                   <>
                                   
                                    <TableCell align="right" >
                                        <Button
                                          style={{ backgroundColor: '#808080', fontSize: 12 }}
                                          variant="contained"
                                          startIcon={<Icon icon={cliente} style={{ color: 'white', fontSize: 20 }} />}
                                          onClick={() => ClienteModal(CLIENTE_ATACADO)}
                                        >
                                          Cliente
                                        </Button>
                                    </TableCell>
    
                                      <TableCell align="left">
                                        <Link to={URL} style={{ textDecoration: 'none', cursor: 'pointer' }} component={RouterLink}>
                                          <Button
                                            style={{ marginLeft: 20, backgroundColor: 'blue', fontSize: 12 }}
                                            variant="contained"
                                            startIcon={<Icon icon={item} style={{ marginLeft: 20, color: 'white', fontSize: 20 }} />}
                                          >
                                            ITEMS
                                          </Button>
                                        </Link>
                                      </TableCell>
                                    </>
                                    :
                                    ''
                                }


                              </TableRow>
                            );
                          })


                      }
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                    {isUserNotFound && (
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                            <SearchNotFound searchQuery={filterName} />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>


                </TableContainer>
              </Scrollbar>

              <TablePagination
                rowsPerPageOptions={[20, 30, 50]}
                component="div"
                count={resultado.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />

            </>

          }
        </Card>

      </Container>
    </Page>
  );
}

import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import item from '@iconify/icons-eva/external-link-outline';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import devolvido from '@iconify/icons-eva/swap-outline';
import busca from '@iconify/icons-eva/search-outline';
// material
import {
  Link,
  Card,
  Table,
  Stack,
  Avatar,
  CircularProgress,
  Button,
  Checkbox,
  TextField,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Grid,
  Paper
} from '@material-ui/core';
// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../../components/dashboard/user';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import axios from 'axios';
import React, { useEffect, useContext } from 'react';

import { AuthContext } from '../../../content/contentGeral';
import { useCookies } from 'react-cookie';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'NF_FORNCEDOR', label: 'NF_Origem', alignRight: false },
  { id: 'NF_FORNCEDOR', label: 'NF', alignRight: false },
  { id: 'PEDIDO', label: 'Pedido', alignRight: false },
  { id: 'CLIENTE_ATACADO', label: 'Cliente', alignRight: false },
  { id: 'REPRESENTANTE', label: 'Representante', alignRight: false },
  { id: 'TOT_QTDE_ORIGINAL', label: 'QTDE', alignRight: false },
  { id: 'TOT_VALOR_ORIGINAL', label: 'Total', alignRight: false }

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

  let data = new Date();

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [resultado, setResultado] = useState([{
    "PEDIDO": "",
    "CLIENTE_ATACADO": "",
    "REPRESENTANTE": "",
    "TOT_QTDE_ORIGINAL": "CARREGANDO ...",
    "TOT_VALOR_ORIGINAL": "",
    "ENTREGA": ""
  }]);

  const [open, setOpen] = useState(false);
  const { token, tipo_venda,usuario,dataInicio,setDataInicio,dataFim, setDataFim} = useContext(AuthContext);

  const [statusCarregar, setStatusCarregar] = useState(true);

  const [openNota, setOpenNota] = useState(false);
  const [openCamposNota, setOpenCamposNota] = useState(true);
  const [msgCarregarNota, setMsgCarregarNota] = useState(false);



  const [pedido, setPedido] = useState('');
  const [numeroNota, setNumeroNota] = useState('');
  const [msgCarregar, setMsgCarregar] = useState(false);
  const [numeroNotaDevolucao, setNumeroNotaDevolucao] = useState('');
  const [chaveNotaDevolucao, setChaveNotaDevolucao] = useState('');
  const [chaveNota, setChaveNota] = useState('');

  const [transportadora, setTransportadora] = useState('');
  const [codigoRastreio, setCodigoRastreio] = useState('');

  const [msgResposta, setMsgResposta] = useState(false);
  const [msgInformativo, setMsgInformativo] = useState(false);

  const { REACT_APP_API } = process.env;

  useEffect(() => {
    var Data1 = 'iniciou'
    var Data2 = ''
    buscarProdutos(Data1, Data2);
  }, [])

  const [autenticado]   = useCookies(['autenticado']);

  async function buscarProdutos(Data1, Data2) {

    var dataInicialMes = 0;

    if(dataInicio == '' && dataFim == ''){

        if (Data1 == 'iniciou') {
          
          if((data.getMonth() - 4) == 0){
            dataInicialMes = 1
          }else{
            dataInicialMes = data.getMonth() - 4
          }

          if ((data.getMonth() - 4) < 9) {
            //se for menor que 9 acrecentar um zero para validar a data
            setDataInicio(data.getFullYear() + '-0' + dataInicialMes + '-' + data.getDate());
            Data1 = data.getFullYear() + '-0' + dataInicialMes + '-' + data.getDate();
          } else {
            setDataInicio(data.getFullYear() + '-' + dataInicialMes + '-' + data.getDate())
            Data1 = data.getFullYear() + '-' + dataInicialMes + '-' + data.getDate();
          }

          if ((data.getMonth() + 1) < 9) {
            //se for menor que 9 acrecentar um zero para validar a data
            setDataFim(data.getFullYear() + '-0' + (data.getMonth() + 1) + '-' + data.getDate())
            Data2 = data.getFullYear() + '-0' + (data.getMonth() + 1) + '-' + data.getDate();
          } else {
            setDataFim(data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate())
            Data2 = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate();
          }
        }
    }else{

      Data1 = dataInicio;
      Data2 = dataFim;

    }

    //BUSCAR PRODUTOS NA API
    console.log(Data1)
    console.log(Data2)

    await axios({
      method: 'POST',
      url: REACT_APP_API + '/parceiro/pedido_devolvido',
      headers: {
        'token': autenticado.token
      },
      data: {
        "tipo_venda": autenticado.tipo_venda,
        "dataInicio": Data1,
        "dataFinal": Data2,
      }
    }).then(async function (response) {
      if (response.status == 200) {
        setStatusCarregar(false)
        setResultado(await response.data)
        console.log(resultado)

      } else {
        setStatusCarregar(false)
        setResultado([{
          "PEDIDO": "Nenhuma nota encontrada nesse período ",

        }])

        console.log(resultado)
      }

    }).catch(function (error) {
      console.log(error);
    });
  }



  const NotaModal = async (NF_FORNECEDOR) => {


    setMsgResposta(false);
    setOpenNota(true);
    setOpenCamposNota(false);

    await axios({
      method: 'POST',
      url: REACT_APP_API + '/parceiro/pedido_devolvido_item_notafiscal',
      headers: {
        'token': autenticado.token
      },
      data: {
        "numero_nota": NF_FORNECEDOR
      }

    }).then(async function (response) {

      setMsgCarregarNota(false);
      setOpenCamposNota(true);

      console.log(response.data[0])

      if (response.status === 200) {

        setMsgInformativo('')

        setNumeroNota(response.data[0].NF_DEVOLUCAO);
        setChaveNota(response.data[0].CHAVE_NFE_DEVOLUCAO);
        //setTransportadora(response.data[0].TRANSPORTADORA);
        //setCodigoRastreio(response.data[0].CODIGO_RASTREIO);

      } else {

        setMsgInformativo('Erro não encontrou a nota fiscal tente novamente!');

      }

    }).catch(function (error) {
      console.log(error);
    });

  };

  const handleCloseNota = () => {
    setOpenNota(false);
  };

  const MudarDataInicio = (event) => {
    console.log(event.target.value)
    setDataInicio(event.target.value);
  };

  const MudarDataFinal = (event) => {
    console.log(event.target.value)
    setDataFim(event.target.value);
  };


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


  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - resultado.length) : 0;
  const filteredUsers = applySortFilter(resultado, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="KING&JOE-PARCEIRO">


      <Dialog
        open={openNota}
        onClose={handleCloseNota}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Dados da Nota Fiscal
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {msgCarregar == true ?
              <Stack sx={{ color: 'grey.900', marginLeft: '30%' }} spacing={2} direction="row">
                <CircularProgress color="success" />
              </Stack>
              :
              <h4>{msgInformativo}</h4>
            }

            {
              openCamposNota ?
                <>
                  <TextField
                    style={{ marginTop: 20, width: '100%' }}
                    id="outlined-number"
                    label="NUMERO DA NOTA "
                    type="number"

                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={numeroNota}

                  />
                  <p>
                    <TextField
                      style={{ marginTop: 20, width: '100%' }}
                      id="outlined-number"
                      label="CHAVE DA NOTA "
                      type="number"

                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={chaveNota}

                    />
                  </p>





                </>
                : ''
            }

          </DialogContentText>
          <DialogActions>
            <Button onClick={handleCloseNota}>FECHAR</Button>

          </DialogActions>
        </DialogContent>
      </Dialog>




      <Container>
        <Stack direction="row" alignItems="center" justifyContent="flex-start" mb={12}>
          <Typography variant="h4" gutterBottom>
            Pedidos Devolvidos
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="flex-end" mb={12} style={{ marginTop: -90 }}>

        </Stack>

        <Card>


          <Grid container spacing={2}>

            <Grid item  xs={12} sm={3} md={4}>
              <UserListToolbar
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
              />
            </Grid>


            <Grid item xs={12} sm={3} md={2.4} style={{ marginTop: 20 }} >
              <TextField
                id="date"
                label="DATA INICIO"
                type="date"
                value={dataInicio}
                onChange={MudarDataInicio}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item  xs={12} sm={3} md={2.4} style={{ marginTop: 20 }}>
              <TextField
                id="date"
                label="DATA FIM"
                type="date"
                value={dataFim}
                onChange={MudarDataFinal}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item  xs={12} sm={3} md={2.4} style={{ marginTop: 30 }}>
              <Button
                style={{ backgroundColor: 'blue', fontSize: 12 }}
                variant="contained"
                startIcon={<Icon icon={busca} style={{ color: 'white', fontSize: 20 }} />}
                onClick={() => buscarProdutos(dataInicio, dataFim)}
              >
                Buscar
              </Button>
            </Grid>
          </Grid>


          {statusCarregar == true ?

            <Stack sx={{ color: 'grey.900', marginLeft: '30%' }} spacing={2} direction="row">
              <CircularProgress color="success" />
            </Stack>
            :

            <>
              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <UserListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={resultado.length}
                      numSelected={selected.length}

                    />
                    <TableBody>
                      {filteredUsers
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {

                          const { NF_DEVOLUCAO, PEDIDO, CLIENTE_ATACADO, REPRESENTANTE, QTDE_DEVOLVIDA, VALOR_DEVOLVIDO, NF_FORNECEDOR_ORIGEM } = row;
                          const URL_ITEM = "/admin/pedido/pedido_devolvido_item/" + NF_DEVOLUCAO

                          return (
                            <TableRow
                              hover
                              key={NF_DEVOLUCAO}
                              tabIndex={-1}
                              role="checkbox"
                            >

                              <TableCell align="left">{NF_FORNECEDOR_ORIGEM}</TableCell>
                              <TableCell align="left">{NF_DEVOLUCAO}</TableCell>
                              <TableCell align="left">{PEDIDO}</TableCell>
                              <TableCell align="left">{CLIENTE_ATACADO}</TableCell>
                              <TableCell align="left">{REPRESENTANTE}</TableCell>
                              <TableCell align="center">{QTDE_DEVOLVIDA}</TableCell>
                              <TableCell align="left" style={{ fontSize: 13, color: '#800000' }}>R$:{typeof VALOR_DEVOLVIDO === 'number' ? VALOR_DEVOLVIDO.toFixed(2) : VALOR_DEVOLVIDO}</TableCell>

                              <TableCell align="right" >

                                <Button
                                  style={{ backgroundColor: 'green', fontSize: 12 }}
                                  variant="contained"
                                  startIcon={<Icon icon={item} style={{ color: 'white', fontSize: 20 }} />}
                                  onClick={() => NotaModal(NF_DEVOLUCAO)}
                                >
                                  Nota
                                </Button>

                              </TableCell>


                              <TableCell align="right" >
                                <Link to={URL_ITEM} style={{ textDecoration: 'none', cursor: 'pointer' }} component={RouterLink}>
                                  <Button
                                    style={{ backgroundColor: 'blue', fontSize: 12 }}
                                    variant="contained"
                                    startIcon={<Icon icon={item} style={{ color: 'white', fontSize: 20 }} />}
                                  >
                                    Itens
                                  </Button>
                                </Link>
                              </TableCell>



                            </TableRow>
                          );
                        })}
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
                rowsPerPageOptions={[10, 20, 50]}
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

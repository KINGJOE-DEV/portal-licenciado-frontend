import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import aprovado from '@iconify/icons-eva/checkmark-outline';
import cancelado from '@iconify/icons-eva/close-outline';
import item from '@iconify/icons-eva/external-link-outline';
import busca from '@iconify/icons-eva/search-outline';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';


// material
import {
  Link,
  Card,
  Table,
  Stack,
  Avatar,
  CircularProgress,
  Grid,
  Button,
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
import Page from '../../../components/Page';
import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../../components/dashboard/user';


import axios from 'axios';
import React, { useEffect, useContext } from 'react';

import { AuthContext } from '../../../content/contentGeral';
import { useCookies } from 'react-cookie';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'PEDIDO', label: 'Pedido', alignRight: false },
  { id: 'CLIENTE_ATACADO', label: 'Cliente', alignRight: false },
  { id: 'REPRESENTANTE', label: 'Representante', alignRight: false },
  { id: 'TOT_QTDE_ORIGINAL', label: 'QTDE', alignRight: false },
  { id: 'TOT_VALOR_ORIGINAL', label: 'Total', alignRight: false },


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




  const { token, tipo_venda ,dataInicio,setDataInicio,dataFim, setDataFim} = useContext(AuthContext);
  const [statusCarregar, setStatusCarregar] = useState(true);


  const { REACT_APP_API } = process.env;

  const [autenticado]   = useCookies(['autenticado']);

  useEffect(() => {
    var Data1 = 'iniciou'
    var Data2 = ''
    buscarProdutos(Data1, Data2);
  }, [])


  async function buscarProdutos(Data1, Data2) {

    setStatusCarregar(true)

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
      url: REACT_APP_API + '/parceiro/pedido_cancelado',
      headers: {
        'token' : autenticado.token
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



  const MudarDataInicio = (event) => {
    console.log(event.target.value)
    setDataInicio(event.target.value);
  };

  const MudarDataFinal = (event) => {
    console.log(event.target.value)
    setDataFim(event.target.value);
  };


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
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





      <Container>
        <Stack direction="row" alignItems="center" justifyContent="flex-start" mb={12}>
          <Typography variant="h4" gutterBottom>
            Pedidos Cancelados
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="flex-end" mb={12} style={{ marginTop: -90 }}>

        </Stack>




        <Card>



          <Grid container spacing={2}>

            <Grid item xs={12} sm={3} md={4}>
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

                          const { PEDIDO, CLIENTE_ATACADO, REPRESENTANTE, QTDE_CANCELADA, VALOR_CANCELADO } = row;
                          const URL_ITEM = "/admin/pedido/pedido_cancelado_item/" + PEDIDO

                          return (
                            <TableRow
                              hover
                              key={PEDIDO}
                              tabIndex={-1}
                              role="checkbox"
                            >

                              <TableCell align="left">{PEDIDO}</TableCell>
                              <TableCell align="left">{CLIENTE_ATACADO}</TableCell>
                              <TableCell align="left">{REPRESENTANTE}</TableCell>
                              <TableCell align="left">{QTDE_CANCELADA}</TableCell>
                              <TableCell align="left" style={{ fontSize: 13, color: '#800000' }}>R$:{typeof VALOR_CANCELADO === 'number' ? VALOR_CANCELADO.toFixed(2) : VALOR_CANCELADO}</TableCell>

                              {QTDE_CANCELADA  > 0 ?
                                <TableCell align="left">
                                  <Link to={URL_ITEM} style={{ textDecoration: 'none', cursor: 'pointer' }} component={RouterLink}>
                                    <Button
                                      style={{ backgroundColor: 'blue', fontSize: 12 }}
                                      variant="contained"
                                      startIcon={<Icon icon={item} style={{ color: 'white', fontSize: 20 }} />}
                                    >
                                      ITEMS
                                    </Button>
                                  </Link>
                                </TableCell>
                                : ''
                              }


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

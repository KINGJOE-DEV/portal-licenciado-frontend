import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState } from 'react';

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

import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../components/dashboard/user';

import axios from 'axios';
import React, { useEffect, useContext } from 'react';

import { AuthContext } from '../../content/contentGeral';
import { useCookies } from 'react-cookie';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'CLIENTE_ATACADO', label: 'Cliente', alignRight: false },
  { id: 'REPRESENTANTE', label: 'Representante', alignRight: false },
  { id: 'TOT_QTDE_ORIGINAL', label: 'CNPJ', alignRight: false },
  { id: 'RAZAO SOCIAL', label: 'Razão Social', alignRight: false },
  { id: 'CEP', label: 'CEP', alignRight: false },
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
    return filter(array, (_user) => _user.CLIENTE_ATACADO.toLowerCase().indexOf(query.toLowerCase()) !== -1);
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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [resultado, setResultado] = useState([{
    "PEDIDO": ""
  }]);

  const { token, tipo_venda, Sair, statusCarregar, setStatusCarregar } = useContext(AuthContext);

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
      url: REACT_APP_API + '/cliente',
      headers: {
        'token': autenticado.token
      },
      data: {
        "tipo_venda": autenticado.tipo_venda,

      }
    }).then(async function (response) {
      if (response.status == 200) {

        setStatusCarregar(false)
        setResultado(await response.data)
        console.log(resultado)

      } else {
        setResultado([{
          "PEDIDO": "",
          "CLIENTE_ATACADO": "",
          "REPRESENTANTE": "",
          "TOT_QTDE_ORIGINAL": "CARREGANDO ...",
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
            Lista de Clientes
          </Typography>
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
                    <UserListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={resultado.length}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}

                    />


                    <TableBody>
                      {filteredUsers
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {

                          const { CLIENTE_ATACADO, REPRESENTANTE, CGC_CPF, RAZAO_SOCIAL, CEP } = row;
                          const URL = "/admin/cliente_detalhe/" + CLIENTE_ATACADO


                          return (
                            <TableRow
                              hover
                              key={CLIENTE_ATACADO}
                              tabIndex={-1}
                              role="checkbox"

                            >


                              <TableCell align="left">{CLIENTE_ATACADO}</TableCell>
                              <TableCell align="left">{REPRESENTANTE}</TableCell>
                              <TableCell align="left">{CGC_CPF}</TableCell>
                              <TableCell align="left">{RAZAO_SOCIAL}</TableCell>
                              <TableCell align="left">{CEP}</TableCell>
                              <TableCell align="left">
                                <Link to={URL} style={{ textDecoration: 'none', cursor: 'pointer' }} component={RouterLink}>
                                  <Button
                                    style={{ marginLeft: 20, backgroundColor: 'blue', fontSize: 12 }}
                                    variant="contained"
                                    startIcon={<Icon icon={item} style={{ marginLeft: 20, color: 'white', fontSize: 20 }} />}
                                  >
                                    DETALHES
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

import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import aprovado from '@iconify/icons-eva/checkmark-outline';
import cancelado from '@iconify/icons-eva/close-outline';
import item from '@iconify/icons-eva/maximize-outline';

import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';

import moment from 'moment';
// material
import {
  Link,
  Card,
  Table,
  Stack,
  Avatar,
  TextField,
  CircularProgress,
  Button,
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

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { AuthContext } from '../../../content/contentGeral';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'PRODUTO', label: 'Produto', alignRight: false },
  { id: 'COR_PRODUTO', label: 'Cor', alignRight: false },
  { id: 'TOT_QTDE_ORIGINAL', label: 'QTDE', alignRight: false },
  { id: 'VALOR_ENTREGAR', label: 'Valor', alignRight: false },
  { id: 'VALOR_ENTREGARD', label: 'Total', alignRight: false },
  { id: 'GRADE', label: 'Grade', alignRight: false },
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
    return filter(array, (_user) => _user.PRODUTO.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
// ----------------------------------------------------------------------



export default function User(props) {

  const prop = useParams();
  console.log('prop', prop.numeroNota)

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [resultado, setResultado] = useState([{
    "SEQUENCIAL_DIGITACAO": "",
    "PRODUTO": "",
    "COR": "CARREGANDO ...",
    "TOT_QTDE_ORIGINAL": "",
    "VALOR_ENTREGAR": "",
    "ENTREGA": "",
    "GRADE": ""
  }]);


  const [numeroNota, setNumeroNota] = useState('');
  const [chaveNota, setChaveNota] = useState('');
  const [codigoRastreio, setCodigoRastreio] = useState('');

  const { token } = useContext(AuthContext);
  const [fecharGrade, setFecharGrade] = useState([]);
  const [grade, setGrade] = useState([]);
  const [gradeFinal, setGradeFinal] = useState([]);

  const { REACT_APP_API } = process.env;
  console.log(REACT_APP_API)



  useEffect(() => {
    buscarProdutos()

  }, [])



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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };



  async function buscarProdutos() {
    //BUSCAR PRODUTOS NA API
    await axios({
      method: 'POST',
      url: REACT_APP_API + '/parceiro/pedido_devolvido_item',
      headers: {
        'token': token
      },
      data: {
        "numero_nota": prop.numeroNota
      }

    }).then(async function (response) {

      if (response.status == 200) {

        setResultado(await response.data)
        console.log(resultado)

      } else {
        setResultado([{

          "SEQUENCIAL_DIGITACAO": "",
          "PRODUTO": "",
          "COR": "CARREGANDO ...",
          "TOT_QTDE_ORIGINAL": "",
          "VALOR_ENTREGAR": "",
          "ENTREGA": "",
          "GRADE": ""

        }])

        console.log(resultado)
      }

    }).catch(function (error) {
      console.log(error);
    });
  }



  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - resultado.length) : 0;
  const filteredUsers = applySortFilter(resultado, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="KING&JOE-PARCEIRO">



      <Container>
        <Stack direction="row" alignItems="center" justifyContent="flex-start" mb={12}>
          <Typography variant="h4" gutterBottom>
            Devolvido itens da Fatura : {prop.numeroNota}
          </Typography>

        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />


          <>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 900 }}>
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

                        const { ID, DESC_PRODUTO, DESC_COR_PRODUTO, QTDE_DEVOLVIDA, VALOR_DEVOLVIDO, PRODUTO, COR_PRODUTO, PRECO1, LICENCIADO_ENTREGA, LICENCIADO_ENTREGA_LIMITE, F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, TAMANHO_1, TAMANHO_2, TAMANHO_3, TAMANHO_4, TAMANHO_5, TAMANHO_6, TAMANHO_7, TAMANHO_8, TAMANHO_9, TAMANHO_10 } = row;


                        return (
                          <TableRow
                            hover
                            key={ID}
                            tabIndex={-1}
                            role="checkbox"

                          >


                            <TableCell align="left" style={{ fontSize: 13 }} >{DESC_PRODUTO} <p style={{ fontSize: 13, color: '#800000' }}>{PRODUTO}</p></TableCell>
                            <TableCell align="left" style={{ fontSize: 13 }} >{DESC_COR_PRODUTO}  <p style={{ fontSize: 13, color: '#800000' }}>{COR_PRODUTO}</p></TableCell>
                            <TableCell align="center" style={{ fontSize: 13 }} >{QTDE_DEVOLVIDA}</TableCell>
                            <TableCell align="left" style={{ fontSize: 13, color: '#800000' }}>R$:{typeof PRECO1 === 'number' ? PRECO1.toFixed(2) : PRECO1}</TableCell>
                            <TableCell align="left" style={{ fontSize: 13, color: '#800000' }}>R$:{typeof VALOR_DEVOLVIDO === 'number' ? VALOR_DEVOLVIDO.toFixed(2) : VALOR_DEVOLVIDO}</TableCell>

                            <TableCell align="center">
                              <TableRow >
                                {TAMANHO_1 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF' }} align="center" >{TAMANHO_1}</TableCell> : ''}
                                {TAMANHO_2 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF' }} align="center" >{TAMANHO_2}</TableCell> : ''}
                                {TAMANHO_3 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF' }} align="center" >{TAMANHO_3}</TableCell> : ''}
                                {TAMANHO_4 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF' }} align="center" >{TAMANHO_4}</TableCell> : ''}
                                {TAMANHO_5 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF' }} align="center" >{TAMANHO_5}</TableCell> : ''}
                                {TAMANHO_6 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF' }} align="center" >{TAMANHO_6}</TableCell> : ''}
                                {TAMANHO_7 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF' }} align="center" >{TAMANHO_7}</TableCell> : ''}
                                {TAMANHO_8 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF' }} align="center" >{TAMANHO_8}</TableCell> : ''}
                                {TAMANHO_9 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF' }} align="center" >{TAMANHO_9}</TableCell> : ''}
                                {TAMANHO_10 ? <TableCell style={{ backgroundColor: '#4F4F4F', color: '#FFFF' }} align="center" >{TAMANHO_10}</TableCell> : ''}
                              </TableRow>
                              <TableRow>
                                {TAMANHO_1 ? <TableCell align="center" >{F1}</TableCell> : ''}
                                {TAMANHO_2 ? <TableCell align="center" >{F2}</TableCell> : ''}
                                {TAMANHO_3 ? <TableCell align="center" >{F3}</TableCell> : ''}
                                {TAMANHO_4 ? <TableCell align="center" >{F4}</TableCell> : ''}
                                {TAMANHO_5 ? <TableCell align="center" >{F5}</TableCell> : ''}
                                {TAMANHO_6 ? <TableCell align="center" >{F6}</TableCell> : ''}
                                {TAMANHO_7 ? <TableCell align="center" >{F7}</TableCell> : ''}
                                {TAMANHO_8 ? <TableCell align="center" >{F8}</TableCell> : ''}
                                {TAMANHO_9 ? <TableCell align="center" >{F9}</TableCell> : ''}
                                {TAMANHO_10 ? <TableCell align="center" >{F10}</TableCell> : ''}
                              </TableRow>

                              <div style={{}}>
                                Entrega : {moment(LICENCIADO_ENTREGA).utc().format('DD/MM/YYYY')} |  Limite : {moment(LICENCIADO_ENTREGA_LIMITE).utc().format('DD/MM/YYYY')}
                              </div>

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

        </Card>
      </Container>
    </Page>
  );
}

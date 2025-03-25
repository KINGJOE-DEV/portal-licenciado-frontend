import React from 'react';

import { UserListHead } from '../../components/dashboard/user';
import ReactToPrint from "react-to-print";
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
    TableContainer,
    TablePagination,
    Box,
    Toolbar,
    Tooltip,
    IconButton,
    Typography,
    OutlinedInput,
    InputAdornment
} from '@material-ui/core';
import moment from 'moment';


class ComponentToPrint extends React.Component {

    constructor(props) {
        super(props);
        console.log(this.props)
        const total = 0;

    }

    render() {

        const TABLE_HEAD = [
            { id: 'PRODUTO', label: '', alignRight: false },
            { id: 'COR_PRODUTO', label: '', alignRight: false },
            { id: 'TOT_QTDE_ORIGINAL', label: '', alignRight: false },
            { id: 'VALOR_ENTREGAR', label: '', alignRight: false },
            { id: 'GRADE', label: '', alignRight: false },
        ];

        return (

            <table border="1" style={{ width: 1000 }}>

                {this.props.data.data.map((row) => {

                    const { DATA_RECEBIMENTO,ID, NOME_CLIFOR, REPRESENTANTE, CGC_CPF, ENDERECO, COLECAO, UF, DDD1, TELEFONE1, RG_IE, PRODUTO, COR_PRODUTO, CIDADE, NUMERO, ITEM_PEDIDO, CEP, RAZAO_SOCIAL, DESC_PRODUTO, DESC_COR_PRODUTO, QTDE_ENTREGAR, DESC_COND_PGTO, PEDIDO, VALOR_ENTREGAR, LICENCIADO_ENTREGA, LICENCIADO_ENTREGA_LIMITE, PRECO1, ENTREGA, VE1, VE2, VE3, VE4, VE5, VE6, VE7, VE8, VE9, VE10, TAMANHO_1, TAMANHO_2, TAMANHO_3, TAMANHO_4, TAMANHO_5, TAMANHO_6, TAMANHO_7, TAMANHO_8, TAMANHO_9, TAMANHO_10 } = row;

                    return (
                        <>
                            {ID == 1 ?
                                <>

                                    <TableRow align="center" colspan='7' >
                                        <TableCell colspan='6' align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 10, paddingBottom: 0, borderColor: 'white', border: 'none' }} >
                                            <img src='/static/logo.svg' style={{ widht: 50, height: 20, marginLeft: 400, marginTop: 20, marginBottom: 10 }} />
                                        </TableCell>
                                    </TableRow>

                                    <TableRow align="center">
                                        <TableCell colspan='3' align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'white', borderTopColor: 'black' ,borderBottomColor: 'black'}} >RAZAO SOCIAL : {RAZAO_SOCIAL}</TableCell>
                                        <TableCell align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'white', border: 'none' }} ></TableCell>
                                        <TableCell align="left" style={{ fontSize: 8, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'white', border: 'none' }} > </TableCell>
                                        <TableCell align="left" style={{ fontSize: 8, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'white', border: 'none' }} ></TableCell>
                                        <TableCell colspan='2' align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'white' }} > PEDIDO : {PEDIDO}</TableCell>
                                    </TableRow>

                                    <TableRow align="center">
                                        <TableCell colspan='2' align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'white', paddingLeft: 40 }} > REPRESENTANTE : {REPRESENTANTE}</TableCell>
                                        <TableCell align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'white', border: 'none' }} ></TableCell>
                                        <TableCell colspan='3' align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'black' }} >RECEBIMENTO : {DATA_RECEBIMENTO} </TableCell>
                                        <TableCell colspan='3' align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'white' }} > COND_PAGTO : {DESC_COND_PGTO}</TableCell>
                                    </TableRow>

                                    <TableRow align="center" >
                                        <TableCell colspan='2' align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'white' }} > CNPJ : {CGC_CPF}</TableCell>
                                        <TableCell align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'white' }} > CEP : {CEP}</TableCell>
                                        <TableCell colspan='3' align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'white', border: 'none' }} >  LOJA : {NOME_CLIFOR}</TableCell>
                                        <TableCell colspan='3' align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'white' }} > COLECAO : {COLECAO}</TableCell>
                                    </TableRow>

                                    <TableRow align="center" >
                                        <TableCell colspan='2' align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'white' }} > IE : {RG_IE}</TableCell>
                                        <TableCell align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'white' }} > RUA : {ENDERECO} {NUMERO} </TableCell>
                                        <TableCell colspan='3' align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'white' }} >ENTREGA : {this.props.data.entrega == '' ? LICENCIADO_ENTREGA : moment(this.props.data.entrega).utc().format('DD/MM/YYYY')} </TableCell>
                                        <TableCell colspan='3' align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'white' }} > QTDE TOTAL : {this.props.data.qtde_total}</TableCell>
                                    </TableRow>

                                    <TableRow align="center" >
                                        <TableCell colspan='2' align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'black' }} > TELEFONE : {DDD1 + TELEFONE1}</TableCell>
                                        <TableCell align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'black' }} > CIDADE : {CIDADE} {UF}</TableCell>
                                        <TableCell colspan='3' align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'black' }} >LIMITE:{this.props.data.entrega == '' ? LICENCIADO_ENTREGA_LIMITE : moment(this.props.data.limite).utc().format('DD/MM/YYYY')}   </TableCell>
                                        <TableCell colspan='3' align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'black' }} > TOTAL : R$ {this.props.data.valor_total.toFixed(2)}</TableCell>
                                    </TableRow>

                                    <TableRow align="center" >
                                        <TableCell colspan='2' align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'white', border: 'none' }} > </TableCell>
                                        <TableCell align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'white', border: 'none' }} > </TableCell>
                                        <TableCell align="left" style={{ fontSize: 8, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'white', border: 'none' }} > </TableCell>
                                        <TableCell align="left" style={{ fontSize: 8, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'white', border: 'none' }} > </TableCell>
                                        <TableCell align="left" style={{ fontSize: 8, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'white', border: 'none' }} > </TableCell>
                                        <TableCell colspan='3' align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'white', border: 'none' }} > </TableCell>
                                    </TableRow>

                                    <TableRow align="center" >
                                        <TableCell align="center" style={{ fontSize: 11, paddingTop: 0, paddingRight: 0, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, backgroundColor: '#4F4F4F', color: '#FFFF', }} > REF </TableCell>
                                        <TableCell align="center" style={{ fontSize: 11, paddingTop: 0, paddingRight: 0, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, backgroundColor: '#4F4F4F', color: '#FFFF', }} > COR </TableCell>
                                        <TableCell align="center" style={{ fontSize: 11, paddingTop: 0, paddingRight: 0, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, backgroundColor: '#4F4F4F', color: '#FFFF', }} >PRODUTO </TableCell>
                                        <TableCell align="center" style={{ fontSize: 11, paddingTop: 0, paddingRight: 0, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, backgroundColor: '#4F4F4F', color: '#FFFF', }} >DESC_COR </TableCell>
                                        <TableCell align="center" style={{ fontSize: 11, paddingTop: 0, paddingRight: 0, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, backgroundColor: '#4F4F4F', color: '#FFFF', }} >QTDE </TableCell>
                                        <TableCell align="center" style={{ fontSize: 11, paddingTop: 0, paddingRight: 0, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, backgroundColor: '#4F4F4F', color: '#FFFF', }} >VALOR </TableCell>
                                        <TableCell align="center" style={{ fontSize: 11, paddingTop: 0, paddingRight: 0, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, backgroundColor: '#4F4F4F', color: '#FFFF', }} >TOTAL </TableCell>
                                        <TableCell colspan='3' align="center" style={{ fontSize: 11, paddingTop: 0, paddingRight: 0, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, backgroundColor: '#4F4F4F', color: '#FFFF', }} > GRADE </TableCell>
                                    </TableRow>


                                </>
                                : ''
                            }

                            <tr>
                                <TableCell align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 10, padding: 0 }} >{PRODUTO}</TableCell>
                                <TableCell align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 10, padding: 0 }} >{COR_PRODUTO}</TableCell>
                                <TableCell align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 10, padding: 0 }} > {DESC_PRODUTO}</TableCell>
                                <TableCell align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 10, padding: 0 }} > {DESC_COR_PRODUTO}</TableCell>
                                <TableCell align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 10, padding: 0 }} >{QTDE_ENTREGAR}</TableCell>
                                <TableCell align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 10, color: '#800000', padding: 0 }}>R$: {PRECO1.toFixed(2)}</TableCell>
                                <TableCell align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 10, color: '#800000', padding: 0 }}>R$: {VALOR_ENTREGAR.toFixed(2)}</TableCell>
                                <td>
                                    <TableRow>
                                        {TAMANHO_1 ? <TableCell style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, backgroundColor: '#4F4F4F', color: '#FFFF', padding: 5, fontSize: 10, height: 10, }} align="center" >{TAMANHO_1}</TableCell> : ''}
                                        {TAMANHO_2 ? <TableCell style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, backgroundColor: '#4F4F4F', color: '#FFFF', padding: 5, fontSize: 10, height: 10, }} align="center" >{TAMANHO_2}</TableCell> : ''}
                                        {TAMANHO_3 ? <TableCell style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, backgroundColor: '#4F4F4F', color: '#FFFF', padding: 5, fontSize: 10, height: 10, }} align="center" >{TAMANHO_3}</TableCell> : ''}
                                        {TAMANHO_4 ? <TableCell style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, backgroundColor: '#4F4F4F', color: '#FFFF', padding: 5, fontSize: 10, height: 10, }} align="center" >{TAMANHO_4}</TableCell> : ''}
                                        {TAMANHO_5 ? <TableCell style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, backgroundColor: '#4F4F4F', color: '#FFFF', padding: 5, fontSize: 10, height: 10, }} align="center" >{TAMANHO_5}</TableCell> : ''}
                                        {TAMANHO_6 ? <TableCell style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, backgroundColor: '#4F4F4F', color: '#FFFF', padding: 5, fontSize: 10, height: 10, }} align="center" >{TAMANHO_6}</TableCell> : ''}
                                        {TAMANHO_7 ? <TableCell style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, backgroundColor: '#4F4F4F', color: '#FFFF', padding: 5, fontSize: 10, height: 10, }} align="center" >{TAMANHO_7}</TableCell> : ''}
                                        {TAMANHO_8 ? <TableCell style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, backgroundColor: '#4F4F4F', color: '#FFFF', padding: 5, fontSize: 10, height: 10, }} align="center" >{TAMANHO_8}</TableCell> : ''}
                                        {TAMANHO_9 ? <TableCell style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, backgroundColor: '#4F4F4F', color: '#FFFF', padding: 5, fontSize: 10, height: 10, }} align="center" >{TAMANHO_9}</TableCell> : ''}
                                        {TAMANHO_10 ? <TableCell style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, backgroundColor: '#4F4F4F', color: '#FFFF', padding: 5, fontSize: 10, height: 10, }} align="center" >{TAMANHO_10}</TableCell> : ''}
                                    </TableRow>
                                    <TableRow>
                                        {TAMANHO_1 ? <TableCell align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 10, padding: 5 }}>{VE1}</TableCell> : ''}
                                        {TAMANHO_2 ? <TableCell align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 10, padding: 5 }}>{VE2}</TableCell> : ''}
                                        {TAMANHO_3 ? <TableCell align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 10, padding: 5 }}>{VE3}</TableCell> : ''}
                                        {TAMANHO_4 ? <TableCell align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 10, padding: 5 }}>{VE4}</TableCell> : ''}
                                        {TAMANHO_5 ? <TableCell align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 10, padding: 5 }}>{VE5}</TableCell> : ''}
                                        {TAMANHO_6 ? <TableCell align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 10, padding: 5 }}>{VE6}</TableCell> : ''}
                                        {TAMANHO_7 ? <TableCell align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 10, padding: 5 }}>{VE7}</TableCell> : ''}
                                        {TAMANHO_8 ? <TableCell align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 10, padding: 5 }}>{VE8}</TableCell> : ''}
                                        {TAMANHO_9 ? <TableCell align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 10, padding: 5 }}>{VE9}</TableCell> : ''}
                                        {TAMANHO_10 ? <TableCell align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 10, padding: 5 }}>{VE10}</TableCell> : ''}
                                    </TableRow>
                                </td>

                            </tr>

                        </>

                    )

                })

                }



            </table >


        );
    }
}




class Example extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <ReactToPrint
                    trigger={() =>

                        <Button style={{ marginLeft: '90%', fontSize: 18 }} >
                            IMPRIMIR
                        </Button>

                    }
                    content={() => this.componentRef}
                />
                <ComponentToPrint data={this.props} ref={(el) => (this.componentRef = el)} />
            </div>
        );
    }
}

export default Example;

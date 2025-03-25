import React from 'react';
import ReactToPrint from "react-to-print";
import {Button,TableRow,TableCell} from '@material-ui/core';
import moment from 'moment';

class ComponentToPrint extends React.Component {

    constructor(props) {
        super(props);
        console.log(this.props)
    }

    render() {

        return (

            <table border="1" style={{ width: 1000 }}>
                <>

                    <TableRow align="center" colspan='7' >
                        <TableCell colspan='6' align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 10, paddingBottom: 0, borderColor: 'white', border: 'none' }} >
                            <img src='/static/logo.svg' style={{ widht: 50, height: 20, marginLeft: 400, marginTop: 20, marginBottom: 10 }} />
                        </TableCell>
                    </TableRow>


                    <TableRow align="center" >
                        <TableCell colspan='2' align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'white', height: 10, border: 'none' }} > </TableCell>
                        <TableCell align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'white', height: 10, border: 'none' }} ></TableCell>
                        <TableCell align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'white', height: 10, border: 'none' }} ></TableCell>

                        <TableCell colspan='2' align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'black' }} >QUANTIDADE : {this.props.data.qtde_total}  </TableCell>
                        <TableCell colspan='2' align="left" style={{ fontSize: 10, paddingTop: 0, paddingRight: 0, paddingLeft: 40, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, borderBottomColor: 'black' }} >TOTAL : R$ {this.props.data.valor_total.toFixed(2)}</TableCell>
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
                        <TableCell align="center" style={{ fontSize: 11, paddingTop: 0, paddingRight: 0, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, backgroundColor: '#4F4F4F', color: '#FFFF', }} > PEDIDO </TableCell>
                        <TableCell align="center" style={{ fontSize: 11, paddingTop: 0, paddingRight: 0, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, backgroundColor: '#4F4F4F', color: '#FFFF', }} > CLIENTE_ATACADO </TableCell>
                        <TableCell align="center" style={{ fontSize: 11, paddingTop: 0, paddingRight: 0, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, backgroundColor: '#4F4F4F', color: '#FFFF', }} >REPRESENTANTE </TableCell>
                        <TableCell align="center" style={{ fontSize: 11, paddingTop: 0, paddingRight: 0, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, backgroundColor: '#4F4F4F', color: '#FFFF', }} >QTDE </TableCell>
                        <TableCell align="center" style={{ fontSize: 11, paddingTop: 0, paddingRight: 0, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, backgroundColor: '#4F4F4F', color: '#FFFF', }} >VALOR </TableCell>
                        <TableCell align="center" style={{ fontSize: 11, paddingTop: 0, paddingRight: 0, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, backgroundColor: '#4F4F4F', color: '#FFFF', }} >RECEBIMENTO </TableCell>
                        <TableCell align="center" style={{ fontSize: 11, paddingTop: 0, paddingRight: 0, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, backgroundColor: '#4F4F4F', color: '#FFFF', }} >ENTREGA </TableCell>
                        <TableCell colspan='3' align="center" style={{ fontSize: 11, paddingTop: 0, paddingRight: 0, paddingBottom: 0, fontWeight: 'bold', color: 'black', height: 10, backgroundColor: '#4F4F4F', color: '#FFFF', }} > ENTREGA LIMITE </TableCell>
                    </TableRow>


                </>


                {this.props.data.data.map((row) => {

                    const { PEDIDO, CLIENTE_ATACADO, REPRESENTANTE, TOT_QTDE_ENTREGAR, TOT_VALOR_ENTREGAR, DATA_RECEBIMENTO, LICENCIADO_ENTREGA, LICENCIADO_ENTREGA_LIMITE } = row;

                    return (
                        <>

                            <tr>
                                <TableCell align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 10, padding: 0 }} >{PEDIDO}</TableCell>
                                <TableCell align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 10, padding: 0 }} >{CLIENTE_ATACADO}</TableCell>
                                <TableCell align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 10, padding: 0 }} > {REPRESENTANTE}</TableCell>
                                <TableCell align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 10, padding: 0 }} > {TOT_QTDE_ENTREGAR}</TableCell>
                                <TableCell align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 10, padding: 0 }} >R$: {TOT_VALOR_ENTREGAR.toFixed(2)}</TableCell>
                                <TableCell align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 10, padding: 0 }} > {moment(DATA_RECEBIMENTO).utc().format('DD/MM/YYYY')} </TableCell>
                                <TableCell align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 10, padding: 0 }} > {moment(LICENCIADO_ENTREGA).utc().format('DD/MM/YYYY')} </TableCell>
                                <TableCell align="center" style={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0, paddingBottom: 0, fontSize: 10, padding: 0 }} > {moment(LICENCIADO_ENTREGA_LIMITE).utc().format('DD/MM/YYYY')}</TableCell>
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

import React, { useState, createContext, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
 
export const AuthContext = createContext({});

function GeralProvider({ children }){

    const [autenticado,setAutenticado,removeAutenticado]   = useCookies(['autenticado'],['token'],['usuario'],['email'],['tipo_venda']);

    const [cnpj,setCnpj]                   = useState();
    const [msg_login,setMsg_login]         = useState();
    const [msg_registrar,setMsg_registrar] = useState();
    const [msg_recuperar,setMsg_recuperar] = useState();
    const [statusCarregar,setStatusCarregar] = useState(false);
    const [validarlogin,setValidarlogin] = useState(1);
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');

    const [caminho_url, setCaminho_url] = useState('');

    const navigate = useNavigate();
    const { REACT_APP_API } = process.env;


    //Funcao para logar o usario
    async function Login(dados){

                    await   axios({
                        method: 'POST',
                        url: REACT_APP_API+'/login',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'  
                        },
                        data: dados
                    
                    }).then(async function (response) {
                        if (response.status === 200) {    

                            //salvar token para ser utilizado 
                            setAutenticado('autenticado', true,{ path: '/' ,maxAge :3000 });
                            setAutenticado('token', response.data.token,{ path: '/' ,maxAge :3000 });
                            setAutenticado('usuario', response.data.rows.recordsets[0][0].nome_clifor, { path: '/' ,maxAge :3000 });
                            setAutenticado('email', response.data.rows.recordsets[0][0].email, { path: '/' ,maxAge :3000 });
                            setAutenticado('tipo_venda', response.data.rows.recordsets[0][0].tipo_venda, { path: '/' ,maxAge :3000 });

                            setCnpj(response.data.rows.recordsets[0][0].cnpj_cpf);
                        
                            setStatusCarregar(false)
                            navigate('/admin/app');
                        
                        } else {
                            setStatusCarregar(false)
                            console.log(response)
                            setMsg_login(response.data);
                        }
                    
                    })
                    .catch(function (error) {
                        setStatusCarregar(false)
                        setMsg_login('API Indisponivel');
                        console.log(error);
                    })  
    }

    async function Sair(){
        //excluir cokkies antigos caso existam
        console.log('APAGAR COOKIE')
        setAutenticado('autenticado', false,{ path: '/'  });
        navigate('/');
    }

    return(
     <AuthContext.Provider value={{ 
            cnpj,
            statusCarregar,
            setStatusCarregar,
            removeAutenticado,
            caminho_url,
            setAutenticado,
            msg_login,msg_recuperar,
            setMsg_recuperar,Login,Sair,validarlogin,setValidarlogin,
            dataInicio, setDataInicio,dataFim, setDataFim
         }}>
         {children}
     </AuthContext.Provider>   
    );
}

export default GeralProvider;
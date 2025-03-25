import * as Yup from 'yup';
import React, {useState, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';

// material
import {
  Alert ,
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
  CircularProgress
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { AuthContext } from '../../../content/contentGeral';

// ----------------------------------------------------------------------

export default function RecuperarSenhaForm() {

    
  const { statusCarregar,Recuperar_senha,msg_recuperar,setMsg_recuperar } = useContext(AuthContext);

  const navigate = useNavigate();
  const [msg, setMgs] = useState(false);
  
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email ivalido').required('Email vazio')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      plataforma:'PARCEIROS'
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {

      Recuperar_senha(values);   
      
    }
  });

  async function Recaregar(){
       
    setMsg_recuperar('');
    
  }




  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <>
      {msg_recuperar ? 
        <>
          <Alert severity="warning"> {msg_recuperar}</Alert>

            <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            style={{marginTop:20}}
            onClick={Recaregar}
            >
              TENTAR NOVAMENTE
            </LoadingButton>
     

        </>

      :
        <FormikProvider value={formik}>
         <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              autoComplete="username"
              type="email"
              label="Email "
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />

            
          </Stack>   

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            style={{marginTop:20}}
          >
            {statusCarregar  ?  
                  <CircularProgress style={{color:'#FFFFFF',fontSize:10}} /> 
                  :
                  'RECUPERAR SENHA'
            }
          </LoadingButton>

         </Form>
        </FormikProvider>
      }
    </>
   
  );
}

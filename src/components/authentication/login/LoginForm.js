import * as Yup from 'yup';
import React, {useState, useContext,useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
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

export default function LoginForm() {

    
  const { statusCarregar,Login,msg_login,setAutenticado } = useContext(AuthContext);

  useEffect(() => {
    //excluir cokkies antigos caso existam
    console.log('APAGAR COOKIE')
    setAutenticado('autenticado', false,{ path: '/'  });
    //removeAutenticado('autenticado');
  }, [])

  const navigate = useNavigate();
  const [showSenha, setShowSenha] = useState(false);
  const [msg, setMgs] = useState(false);
  
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email ivalido').required('Email vazio'),
    senha: Yup.string().required('Senha vazia')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      senha: '',
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {

      Login(values);   
      
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;
  
  const handleShowSenha = () => {
    setShowSenha((show) => !show);

  };



  return (
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

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showSenha? 'text' : 'password'}
            label="Senha"
            {...getFieldProps('senha')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowSenha} edge="end">
                    <Icon icon={showSenha ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.senha && errors.senha)}
            helperText={touched.senha && errors.senha}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Lembre-me"
          />

          <Link component={RouterLink} variant="subtitle2" to="/recuperar_senha">
            Esqueceu a senha ?
          </Link>
        </Stack>
        {msg_login ? 
     
          <Alert severity="warning"> {msg_login}</Alert>
        :
          ''
        }
    

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
              'ENTRAR'
         }
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}

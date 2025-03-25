import * as Yup from 'yup';
import { useState,useContext } from 'react';

import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
// material
import { Alert,Stack, TextField, IconButton, InputAdornment } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { AuthContext } from '../../../content/contentGeral';
// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {Registrar,msg_registrar,autenticado } = useContext(AuthContext);

  const RegisterSchema = Yup.object().shape({
    cnpjcpf: Yup.string()
      .max(14, 'Existe numero a mais no CPNJ!')
      .required('Digite seu CNPJ aqui'),
    email: Yup.string().email('Email invalido').required('Preencha o email'),
    senha: Yup.string().required('Preencha a senha'),
    confirmacao_senha: Yup.string().oneOf([Yup.ref('senha'), null], 'Confirmação de senha não coincide com alterior').required('Preencha a confirmação de senha')
  });

  const formik = useFormik({
    initialValues: {
      plataforma:'PARCEIROS',
      cnpjcpf: '',
      email: '',
      senha: '',
      confirmacao_senha: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: (values,actions) => {
      //navigate('/dashboard', { replace: true });
       console.log('clicou')
       Registrar(values)

      if(msg_registrar != ''){
          actions.setSubmitting(false);
      }
      
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
        {msg_registrar ? 
     
          <Alert severity="warning" style={{marginBottom:15}}> {msg_registrar}</Alert>
        :
         ''
        }
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>

            <TextField
              fullWidth
              label="CNPJ"
              {...getFieldProps('cnpjcpf')}
              error={Boolean(touched.cnpjcpf && errors.cnpjcpf)}
              helperText={touched.cnpjcpf && errors.cnpjcpf}
            />

          </Stack>

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
            type={showPassword ? 'text' : 'password'}
            label="Senha"
            {...getFieldProps('senha')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.senha && errors.senha)}
            helperText={touched.senha && errors.senha}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Confirmação Senha"
            {...getFieldProps('confirmacao_senha')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.confirmacao_senha && errors.confirmacao_senha)}
            helperText={touched.confirmacao_senha && errors.confirmacao_senha}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            REGISTRAR
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}

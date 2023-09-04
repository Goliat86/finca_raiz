import nodemailer from 'nodemailer'


const emailRegistro = async (datos)=>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      const {email, nombre, token}=datos
      //enviar el email
      await transport.sendMail({
        from:'Bienes Raices.com',
        to: email,
        subject: 'Confirma tu cuenta en Bienesraices.com',
        text: 'Confirma tu cuenta en Bienesraices.com',
        html:`
            <p>Hola ${nombre}, comprueba tu cuenta en bienesraices.com</p>
            <p>Confirma tu cuenta en el siguiente enlace: <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar cuenta</a> </p>
            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
      })
}

const emailOlvidePassword = async (datos)=>{
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    const {email, nombre, token}=datos
    //enviar el email
    await transport.sendMail({
      from:'Bienes Raices.com',
      to: email,
      subject: 'Reestablece tu password en Bienesraices.com',
      text: 'Reestablece tu password en Bienesraices.com',
      html:`
          <p>Hola ${nombre},haz solicitado reestablecer tu password en bienesraices.com</p>

          <p>Sigue el siguiente enlace para generar un password nuevo: <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">Reestablecer password</a> </p>
          <p>Si tu no solicitaste el cambio de password, puedes ignorar el mensaje</p>
      `
    })
}

export{
    emailRegistro,
    emailOlvidePassword
}
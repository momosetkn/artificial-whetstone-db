export const sendMail = async (params:{title: string, message: string}) => {
  await fetch(process.env.SEND_MAIL_ENDPOINT || "", {
    method: "POST",
    body: JSON.stringify(params),
    mode: "no-cors",
  });
};

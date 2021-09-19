export const sendMail = async (params:{title: string, message: string}) => {
  const res = await fetch(process.env.SEND_MAIL_ENDPOINT || "", {
    method: "POST",
    body: JSON.stringify(params),
    mode: "cors",
    credentials: "include",
  }).then(x => x.json());

  console.log(res);
};

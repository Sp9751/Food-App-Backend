export const GenerateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 9000);
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
  const accountSid = "ACbc25abb27f06bc9b5b1df1ab7ea9cd70";
  const authToken = "f6017337abc268b0a172026b0623bb70";
  const client = require("twilio")(accountSid, authToken);

  const response = await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: "+12673231415",
    to: `+91${toPhoneNumber}`,
  });

  return response;
};

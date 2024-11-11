export const CreateRandom4Digits = (): number =>{
    var otp = Math.floor(1000+Math.random()*9000);
    return otp;
  } 
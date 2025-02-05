import login from "../../context/auth/authAsync";

export const onChangeForm = function(call){
   return (event)=>call(event.target.value);
}

export const onSubmitForm = async function(email,password,call){
    try{
       await call(login({email,password}));
       return 'login'
    }catch(err){
        console.log(err)
    }
    
}
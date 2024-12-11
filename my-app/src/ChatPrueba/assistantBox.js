import React from 'react';
import Loading from '../components/Loading';
import Spinner from 'react-bootstrap/esm/Spinner';

function AssistantBox({ assistantInput, onPromptChange, onSend, loading }) {
  return (
    <div className="assistant-box" >
      <textarea
        
        value={assistantInput}
        onChange={onPromptChange}
        placeholder="Agrega instrucciones adicionales para el asistente"
      />
      <button onClick={onSend} style={{ fontWeight: 'bold', marginTop: '5px', backgroundColor:"rgb(67, 10, 98)" }}>{loading? <Spinner style={{height:"20px", width:"20px"}}/> : "ENVIAR A ASISTENTE"}</button>
      
    </div>
  );
}

export default AssistantBox;

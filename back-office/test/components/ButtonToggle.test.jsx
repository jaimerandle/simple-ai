import { render,screen,fireEvent} from "@testing-library/react";
import { expect,test } from "vitest";

import ButtonToggle from "../../src/components/buttonToggle/ButtonToggle";
import { createTheme, ThemeProvider } from "@mui/material";

const renderWithTheme = (ui,{theme}={})=>{
    const defaultTheme = createTheme();
    return render(<ThemeProvider theme={theme|| defaultTheme}>{ui}</ThemeProvider>);
}

test('renderizar toggle Button',()=>{
    renderWithTheme(<ButtonToggle label={"on/off"}/>)
    expect(screen.getByText('on/off')).toBeInTheDocument();
})

test('llamar a la funcion onChange',()=>{
    const onChangeMock = vi.fn()
    renderWithTheme(<ButtonToggle label="ON/OFF" onChange={onChangeMock}/>)

    const boton = screen.getByText('ON/Off')
    fireEvent.click(boton)
})

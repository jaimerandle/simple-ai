import { render,screen,fireEvent } from "@testing-library/react";
import { ButtonGeneralCustom } from "../../src/components/ButtonCustom/ButtonCustom";
import { expect, test } from "vitest";
import { createTheme,ThemeProvider } from "@mui/material";
import theme from "../../src/theme/theme";

const renderWithTheme = (ui,{theme}={})=>{
    const defaultTheme = createTheme();
    return render(<ThemeProvider theme={theme || defaultTheme}>{ui}</ThemeProvider>)
}


test('renderiza el botón con el label correcto', () => {
    renderWithTheme(<ButtonGeneralCustom label='Click me'/>,theme)
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  

test('llamar a la funcion Onclick',()=>{
    const onClickMock = vi.fn()
    renderWithTheme(<ButtonGeneralCustom label="Click me" onClick={onClickMock}/>,theme)

    const boton = screen.getByText('Click me')
    fireEvent.click(boton)
    expect(onClickMock).toHaveBeenCalledTimes(1)

})


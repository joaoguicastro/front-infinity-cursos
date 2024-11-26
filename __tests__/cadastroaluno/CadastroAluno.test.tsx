import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CadastroAluno from "../../src/pages/CasdastroAluno/CadastroAluno";

describe("CadastroAluno Component", () => {
  test("deve renderizar o formulário de cadastro de aluno", () => {
    render(<CadastroAluno />);

    // Verificar se os elementos básicos estão renderizados
    expect(screen.getByText("Cadastro de Aluno")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome:")).toBeInTheDocument();
    expect(screen.getByLabelText("CPF:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cadastrar Aluno" })).toBeInTheDocument();
  });

  test("deve permitir entrada de dados nos campos", () => {
    render(<CadastroAluno />);

    const nomeInput = screen.getByLabelText("Nome:");
    const cpfInput = screen.getByLabelText("CPF:");

    fireEvent.change(nomeInput, { target: { value: "João Silva" } });
    fireEvent.change(cpfInput, { target: { value: "12345678901" } });

    expect(nomeInput).toHaveValue("João Silva");
    expect(cpfInput).toHaveValue("12345678901");
  });

  test("deve exibir uma mensagem de sucesso ao cadastrar aluno", () => {
    render(<CadastroAluno />);

    const nomeInput = screen.getByLabelText("Nome:");
    const cpfInput = screen.getByLabelText("CPF:");
    const cadastrarButton = screen.getByRole("button", { name: "Cadastrar Aluno" });

    fireEvent.change(nomeInput, { target: { value: "João Silva" } });
    fireEvent.change(cpfInput, { target: { value: "12345678901" } });
    fireEvent.click(cadastrarButton);

    // Verificar se a mensagem de sucesso aparece
    expect(window.alert).toHaveBeenCalledWith("Aluno cadastrado com sucesso!");
  });
});

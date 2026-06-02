import React, { createContext, useContext, useState } from 'react';

type CursoContextType = {
  cursoAtivo: string;
  setCursoAtivo: (curso: string) => void;
};

const CursoContext = createContext<CursoContextType | undefined>(undefined);

export const CursoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cursoAtivo, setCursoAtivo] = useState('Todos os Cursos');

  return (
    <CursoContext.Provider value={{ cursoAtivo, setCursoAtivo }}>
      {children}
    </CursoContext.Provider>
  );
};

export const useCurso = () => {
  const context = useContext(CursoContext);
  if (!context) {
    throw new Error('useCurso deve ser usado dentro de um CursoProvider');
  }
  return context;
};
import type { NextApiRequest, NextApiResponse } from 'next';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  endereco?: string;
  dataCriacao: string;
}

interface RegistroRequest {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  endereco?: string;
}

interface RegistroResponse {
  success: boolean;
  message: string;
  usuario?: Omit<Usuario, 'senha'>;
  errors?: Record<string, string>;
}

// Simulated database (in a real app, this would be a proper database)
let usuarios: Usuario[] = [];

// Simple password hashing simulation (in production, use bcrypt)
function hashPassword(password: string): string {
  // This is just for demonstration - use proper hashing in production
  return Buffer.from(password).toString('base64');
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateTelefone(telefone: string): boolean {
  // Basic phone validation for Brazilian format
  const phoneRegex = /^[\(\)\d\s\-\+]{10,}$/;
  return phoneRegex.test(telefone);
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegistroResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  const { nome, email, senha, telefone, endereco }: RegistroRequest = req.body;

  // Validation
  const errors: Record<string, string> = {};

  if (!nome || nome.trim().length < 2) {
    errors.nome = 'Nome deve ter pelo menos 2 caracteres';
  }

  if (!email || !validateEmail(email)) {
    errors.email = 'Email inválido';
  }

  if (!senha || senha.length < 6) {
    errors.senha = 'Senha deve ter pelo menos 6 caracteres';
  }

  if (!telefone || !validateTelefone(telefone)) {
    errors.telefone = 'Telefone inválido';
  }

  // Check if email already exists
  if (email && usuarios.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    errors.email = 'Este email já está registrado';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors
    });
  }

  try {
    // Create new user
    const novoUsuario: Usuario = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      nome: nome.trim(),
      email: email.toLowerCase().trim(),
      senha: hashPassword(senha),
      telefone: telefone.trim(),
      endereco: endereco?.trim(),
      dataCriacao: new Date().toISOString()
    };

    // Save user to "database"
    usuarios.push(novoUsuario);

    // Return success response (without password)
    const { senha: _, ...usuarioSemSenha } = novoUsuario;

    return res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      usuario: usuarioSemSenha
    });

  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
import type { NextApiRequest, NextApiResponse } from 'next';

interface LoginRequest {
  email: string;
  senha: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  usuario?: {
    id: string;
    nome: string;
    email: string;
  };
  errors?: Record<string, string>;
}

// Import the users array from registro.ts (in a real app, this would be a shared database)
// For this demo, we'll recreate the same structure
interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  endereco?: string;
  dataCriacao: string;
}

// Simulated database - in a real app, this would be shared
let usuarios: Usuario[] = [];

function hashPassword(password: string): string {
  return Buffer.from(password).toString('base64');
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  const { email, senha }: LoginRequest = req.body;

  // Validation
  const errors: Record<string, string> = {};

  if (!email || !email.includes('@')) {
    errors.email = 'Email inválido';
  }

  if (!senha) {
    errors.senha = 'Senha é obrigatória';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors
    });
  }

  try {
    // Find user by email
    const usuario = usuarios.find(u => 
      u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos',
        errors: { email: 'Usuário não encontrado' }
      });
    }

    // Verify password
    const senhaHash = hashPassword(senha);
    if (usuario.senha !== senhaHash) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos',
        errors: { senha: 'Senha incorreta' }
      });
    }

    // Return success response (without password)
    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
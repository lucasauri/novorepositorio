// ========================================
// SISTEMA DE SEGURANÇA
// ========================================

// ========================================
// 1. SISTEMA DE PERMISSÕES DE USUÁRIOS
// ========================================

const ROLES = {
    ADMIN: 'admin',
    COORDENADOR: 'coordenador',
    USUARIO: 'usuario'
};

const PERMISSOES = {
    admin: ['criar_usuario', 'editar_usuario', 'deletar_usuario', 'visualizar_relatorio', 'fazer_backup', 'gerenciar_permissoes'],
    coordenador: ['criar_usuario', 'editar_usuario', 'visualizar_relatorio', 'ver_backup'],
    usuario: ['ver_perfil', 'editar_perfil', 'visualizar_dados']
};

class Usuario {
    constructor(id, nome, email, role, senha) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.role = role;
        this.senha = this._hashSenha(senha);
        this.dataCriacao = new Date();
        this.ativo = true;
    }

    _hashSenha(senha) {
        // Simula um hash de senha (em produção usar bcrypt)
        return btoa(senha);
    }

    temPermissao(acao) {
        const permissoes = PERMISSOES[this.role] || [];
        return permissoes.includes(acao);
    }

    verificarSenha(senhaDigitada) {
        return this.senha === this._hashSenha(senhaDigitada);
    }
}

class GerenciadorUsuarios {
    constructor() {
        this.usuarios = [];
        this.usuarioLogado = null;
    }

    criarUsuario(id, nome, email, role, senha) {
        if (!this.validarRole(role)) {
            throw new Error('Role inválido: ' + role);
        }
        if (!this.validarSenha(senha)) {
            throw new Error('Senha não atende aos critérios de segurança');
        }
        
        const usuario = new Usuario(id, nome, email, role, senha);
        this.usuarios.push(usuario);
        console.log(`✓ Usuário ${nome} criado com sucesso!`);
        return usuario;
    }

    validarRole(role) {
        return Object.values(ROLES).includes(role);
    }

    obterUsuario(id) {
        return this.usuarios.find(u => u.id === id);
    }

    listarUsuarios() {
        return this.usuarios;
    }

    atualizarUsuario(id, dadosAtualizados) {
        if (!this.usuarioLogado.temPermissao('editar_usuario')) {
            throw new Error('Permissão negada');
        }

        const usuario = this.obterUsuario(id);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        Object.assign(usuario, dadosAtualizados);
        console.log(`✓ Usuário ${id} atualizado`);
        return usuario;
    }

    deletarUsuario(id) {
        if (!this.usuarioLogado.temPermissao('deletar_usuario')) {
            throw new Error('Permissão negada');
        }

        const index = this.usuarios.findIndex(u => u.id === id);
        if (index > -1) {
            this.usuarios.splice(index, 1);
            console.log(`✓ Usuário ${id} deletado`);
        }
    }

    fazerLogin(email, senha) {
        const usuario = this.usuarios.find(u => u.email === email);
        if (!usuario || !usuario.verificarSenha(senha)) {
            throw new Error('Email ou senha inválidos');
        }

        this.usuarioLogado = usuario;
        console.log(`✓ Bem-vindo, ${usuario.nome}!`);
        return usuario;
    }

    fazerLogout() {
        this.usuarioLogado = null;
        console.log('✓ Logout realizado');
    }
}

// ========================================
// 2. VALIDAÇÃO E FORÇA DE SENHA
// ========================================

class ValidadorSenha {
    static NIVEIS = {
        FRACA: 1,
        MEDIA: 2,
        FORTE: 3,
        MUITO_FORTE: 4
    };

    static regras = {
        minimo: 8,
        maiuscula: /[A-Z]/,
        minuscula: /[a-z]/,
        numero: /[0-9]/,
        especial: /[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
    };

    static validarSenha(senha) {
        if (senha.length < this.regras.minimo) {
            return {
                valida: false,
                mensagem: `Senha deve ter no mínimo ${this.regras.minimo} caracteres`
            };
        }

        return { valida: true, mensagem: 'Senha válida' };
    }

    static calcularForca(senha) {
        let pontuacao = 0;
        const requisitos = [];

        if (senha.length >= this.regras.minimo) pontuacao++;
        if (senha.length >= 12) pontuacao++;
        if (this.regras.maiuscula.test(senha)) pontuacao++;
        if (this.regras.minuscula.test(senha)) pontuacao++;
        if (this.regras.numero.test(senha)) pontuacao++;
        if (this.regras.especial.test(senha)) pontuacao++;

        let nivel = this.NIVEIS.FRACA;
        if (pontuacao >= 4) nivel = this.NIVEIS.MEDIA;
        if (pontuacao >= 5) nivel = this.NIVEIS.FORTE;
        if (pontuacao >= 6) nivel = this.NIVEIS.MUITO_FORTE;

        return {
            nivel: nivel,
            pontuacao: pontuacao,
            forca: this._nomeForca(nivel)
        };
    }

    static _nomeForca(nivel) {
        const nomes = {
            1: 'Fraca',
            2: 'Média',
            3: 'Forte',
            4: 'Muito Forte'
        };
        return nomes[nivel];
    }
}

// ========================================
// 3. SISTEMA DE PAGINAÇÃO
// ========================================

class Paginacao {
    constructor(dados, itensPorPagina = 10) {
        this.dados = dados;
        this.itensPorPagina = itensPorPagina;
        this.paginaAtual = 1;
        this.totalPaginas = Math.ceil(dados.length / itensPorPagina);
    }

    irParaPagina(numeroPagina) {
        if (numeroPagina < 1 || numeroPagina > this.totalPaginas) {
            throw new Error(`Página inválida. Total de páginas: ${this.totalPaginas}`);
        }
        this.paginaAtual = numeroPagina;
    }

    obterPaginaAtual() {
        const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
        const fim = inicio + this.itensPorPagina;
        return this.dados.slice(inicio, fim);
    }

    proximaPagina() {
        if (this.paginaAtual < this.totalPaginas) {
            this.paginaAtual++;
        }
        return this.obterPaginaAtual();
    }

    paginaAnterior() {
        if (this.paginaAtual > 1) {
            this.paginaAtual--;
        }
        return this.obterPaginaAtual();
    }

    obterInfo() {
        return {
            paginaAtual: this.paginaAtual,
            totalPaginas: this.totalPaginas,
            totalItens: this.dados.length,
            itensPorPagina: this.itensPorPagina
        };
    }
}

// ========================================
// 4. SISTEMA DE BACKUP
// ========================================

class BackupManager {
    constructor() {
        this.backups = [];
    }

    criar(dados, descricao = '') {
        const backup = {
            id: Date.now(),
            data: new Date(),
            descricao: descricao,
            dados: JSON.parse(JSON.stringify(dados)), // Deep copy
            tamanho: JSON.stringify(dados).length
        };

        this.backups.push(backup);
        console.log(`✓ Backup criado: ${backup.id}`);
        return backup;
    }

    listarBackups() {
        return this.backups.map(b => ({
            id: b.id,
            data: b.data,
            descricao: b.descricao,
            tamanho: `${(b.tamanho / 1024).toFixed(2)} KB`
        }));
    }

    restaurar(backupId) {
        const backup = this.backups.find(b => b.id === backupId);
        if (!backup) {
            throw new Error('Backup não encontrado');
        }

        console.log(`✓ Backup ${backupId} restaurado`);
        return JSON.parse(JSON.stringify(backup.dados));
    }

    deletarBackup(backupId) {
        const index = this.backups.findIndex(b => b.id === backupId);
        if (index > -1) {
            this.backups.splice(index, 1);
            console.log(`✓ Backup ${backupId} deletado`);
        }
    }

    agencarBackup(intervalo, dados, descricao) {
        console.log(`✓ Backup agendado a cada ${intervalo}ms`);
        return setInterval(() => {
            this.criar(dados, `${descricao} - Agendado`);
        }, intervalo);
    }

    exportarBackupJSON(backupId) {
        const backup = this.backups.find(b => b.id === backupId);
        if (!backup) {
            throw new Error('Backup não encontrado');
        }
        return JSON.stringify(backup, null, 2);
    }
}

// ========================================
// EXEMPLO DE USO
// ========================================

console.log('====== SISTEMA DE SEGURANÇA ======\n');

// Criar gerenciador
const gerenciador = new GerenciadorUsuarios();

try {
    // Criar usuários
    console.log('--- Criando Usuários ---');
    gerenciador.criarUsuario(1, 'Admin Silva', 'admin@sistema.com', 'admin', 'SenhaForte123!@');
    gerenciador.criarUsuario(2, 'Coord João', 'coord@sistema.com', 'coordenador', 'SenhaMedia12@');
    gerenciador.criarUsuario(3, 'User Maria', 'user@sistema.com', 'usuario', 'Senha123@user');

    // Login
    console.log('\n--- Fazendo Login ---');
    gerenciador.fazerLogin('admin@sistema.com', 'SenhaForte123!@');

    // Validar senhas
    console.log('\n--- Validando Força de Senhas ---');
    console.log('Senha "abc":', ValidadorSenha.calcularForca('abc'));
    console.log('Senha "MinhaS3nh@123":', ValidadorSenha.calcularForca('MinhaS3nh@123'));

    // Paginação
    console.log('\n--- Sistema de Paginação ---');
    const usuarios = gerenciador.listarUsuarios();
    const paginacao = new Paginacao(usuarios, 2);
    console.log('Página 1:', paginacao.obterPaginaAtual());
    console.log('Info:', paginacao.obterInfo());

    // Backup
    console.log('\n--- Sistema de Backup ---');
    const backupManager = new BackupManager();
    backupManager.criar(usuarios, 'Backup inicial de usuários');
    backupManager.criar(usuarios, 'Backup após inserção');
    console.log('Backups:', backupManager.listarBackups());

} catch (erro) {
    console.error('❌ Erro:', erro.message);
}

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Usuario,
        GerenciadorUsuarios,
        ValidadorSenha,
        Paginacao,
        BackupManager,
        ROLES,
        PERMISSOES
    };
}
//codigo nuvem
//altarações

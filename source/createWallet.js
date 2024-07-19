// Importando as dependências
const bip32   = require('bip32');
const bip39   = require('bip39');
const bitcoin = require('bitcoinjs-lib');

// Definir a rede
const network = bitcoin.networks.bitcoin; 

// Derivação de carteiras HD
const path = `m/49'/1'/0'/0`;

try {
    // Criando um mnemonic para a seed (palavras de senha)
    const mnemonic = bip39.generateMnemonic();

    if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error("Mnemonic inválido");
    }

    const seed = bip39.mnemonicToSeedSync(mnemonic);

    // Criando a raiz da carteira HD
    const root = bip32.fromSeed(seed, network);

    // Criando uma conta - para chaves privadas e públicas
    const account = root.derivePath(path);
    const node = account.derive(0).derive(0);

    if (!node.publicKey) {
        throw new Error("Chave pública não encontrada");
    }

    const btcAddress = bitcoin.payments.p2pkh({
        pubkey: node.publicKey,
        network: network,
    }).address;

    console.log("Carteira gerada");
    console.log("Endereço :", btcAddress);
    console.log("Chave privada :", node.toWIF());
    console.log("Seed", mnemonic);
} catch (error) {
    console.error("Erro ao gerar carteira:", error.message);
}

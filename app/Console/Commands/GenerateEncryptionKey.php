<?php

namespace App\Console\Commands;

use Defuse\Crypto\Key;
use Illuminate\Console\Command;

class GenerateEncryptionKey extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'generate:encryption-key';

    protected $description = 'Generate a new encryption key';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Genera una clave de cifrado aleatoria
        $encryptionKey = Key::createNewRandomKey();

        // Muestra la clave generada en la línea de comandos
        $this->info('Encryption key generated:');
        $this->line($encryptionKey->saveToAsciiSafeString());
    }
}

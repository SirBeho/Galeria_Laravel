<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('detalle', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pedido');
            $table->string('codigo');
            $table->string('cantidad');
            $table->string('comentario')->nullable();
            $table->foreign('pedido')->references('id')->on('pedido');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalle');
    }
};

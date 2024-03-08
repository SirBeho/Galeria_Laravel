<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pedido extends Model
{
    use HasFactory;
    
    protected $table = "pedido";
    protected $fillable = [
        'numero_pedido',
        'nombre',
        'telefono',
        'key',
        'status',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($pedido) {

            $ultimoRegistro = Pedido::max('numero_pedido');
            $pedido->numero_pedido = $ultimoRegistro ? ($ultimoRegistro + 1) : 10000;
        });
    }

    public function detalle(): HasMany
    {
        return $this->hasMany(Detalle::class,'pedido');
    }
    public $timestamps = false;
    
}

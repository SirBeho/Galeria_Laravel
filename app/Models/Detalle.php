<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Detalle extends Model
{
    use HasFactory;
    
    protected $table = "detalle";
    protected $fillable = [
        'pedido',
        'codigo',
        'cantidad',
        'comentario',
       
    ];
    public $timestamps = false;

    public function pedido():  BelongsTo
    {
        return $this->belongsTo(Pedido::class, 'pedido');
    }

}



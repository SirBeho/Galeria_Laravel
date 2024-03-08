<?php

return [

'custom' => [
    'attribute-name' => [
        'rule-name' => 'custom-message',
    ],
    'password' => [

            'min' => 'La contraseña debe contener al menos :min caracteres.',
            'mixedCase' => 'La contraseña debe contener letras mayúsculas y minúsculas.',
            'letters' => 'La contraseña debe contener letras.',
            'numbers' => 'La contraseña debe contener números.',
            'symbols' => 'La contraseña debe contener símbolos.',
            
            'current_required' => 'El campo de contraseña actual es obligatorio.',
            'current_current_password' => 'La contraseña actual es incorrecta.',
            'required' => 'El campo de nueva contraseña es obligatorio.',
            'confirmed' => 'Las contraseñas no coinciden.',
            'default' => 'La contraseña no cumple con los requisitos.', 

    ],
],


];
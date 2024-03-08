-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema u539676568_Q26dW
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema u539676568_Q26dW
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Table `u539676568_Q26dW`.`roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `u539676568_Q26dW`.`roles` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `status` VARCHAR(255) NOT NULL DEFAULT '1',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `u539676568_Q26dW`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `u539676568_Q26dW`.`users` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  `empresa` VARCHAR(255) NULL DEFAULT NULL,
  `rnc` VARCHAR(255) NULL DEFAULT NULL,
  `telefono` VARCHAR(255) NOT NULL,
  `rol_id` BIGINT(20) UNSIGNED NOT NULL,
  `status` VARCHAR(255) NOT NULL DEFAULT '1',
  `remember_token` VARCHAR(100) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `users_email_unique` (`email` ASC) VISIBLE,
  INDEX `users_rol_id_foreign` (`rol_id` ASC) VISIBLE,
  CONSTRAINT `users_rol_id_foreign`
    FOREIGN KEY (`rol_id`)
    REFERENCES `u539676568_Q26dW`.`roles` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `u539676568_Q26dW`.`chirps`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `u539676568_Q26dW`.`chirps` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT(20) UNSIGNED NOT NULL,
  `message` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `chirps_user_id_foreign` (`user_id` ASC) VISIBLE,
  CONSTRAINT `chirps_user_id_foreign`
    FOREIGN KEY (`user_id`)
    REFERENCES `u539676568_Q26dW`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `u539676568_Q26dW`.`estado_solicitudes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `u539676568_Q26dW`.`estado_solicitudes` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `status` VARCHAR(255) NOT NULL DEFAULT '1',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `u539676568_Q26dW`.`tipo_solicitudes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `u539676568_Q26dW`.`tipo_solicitudes` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `tipo` INT(11) NOT NULL,
  `status` VARCHAR(255) NOT NULL DEFAULT '1',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 27
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `u539676568_Q26dW`.`solicitudes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `u539676568_Q26dW`.`solicitudes` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `numero` INT(11) NOT NULL,
  `tipo_id` BIGINT(20) UNSIGNED NOT NULL,
  `user_id` BIGINT(20) UNSIGNED NOT NULL,
  `status_id` BIGINT(20) UNSIGNED NOT NULL,
  `descripcion` TEXT NOT NULL,
  `status` VARCHAR(255) NOT NULL DEFAULT '1',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `solicitudes_numero_unique` (`numero` ASC) VISIBLE,
  UNIQUE INDEX `solicitudes_tipo_id_user_id_created_at_unique` (`tipo_id` ASC, `user_id` ASC, `created_at` ASC) VISIBLE,
  INDEX `solicitudes_user_id_foreign` (`user_id` ASC) VISIBLE,
  INDEX `solicitudes_status_id_foreign` (`status_id` ASC) VISIBLE,
  CONSTRAINT `solicitudes_status_id_foreign`
    FOREIGN KEY (`status_id`)
    REFERENCES `u539676568_Q26dW`.`estado_solicitudes` (`id`),
  CONSTRAINT `solicitudes_tipo_id_foreign`
    FOREIGN KEY (`tipo_id`)
    REFERENCES `u539676568_Q26dW`.`tipo_solicitudes` (`id`),
  CONSTRAINT `solicitudes_user_id_foreign`
    FOREIGN KEY (`user_id`)
    REFERENCES `u539676568_Q26dW`.`users` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `u539676568_Q26dW`.`comentarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `u539676568_Q26dW`.`comentarios` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `solicitud_id` BIGINT(20) UNSIGNED NOT NULL,
  `comentario` VARCHAR(255) NOT NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `comentarios_solicitud_id_foreign` (`solicitud_id` ASC) VISIBLE,
  CONSTRAINT `comentarios_solicitud_id_foreign`
    FOREIGN KEY (`solicitud_id`)
    REFERENCES `u539676568_Q26dW`.`solicitudes` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `u539676568_Q26dW`.`failed_jobs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `u539676568_Q26dW`.`failed_jobs` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` VARCHAR(255) NOT NULL,
  `connection` TEXT NOT NULL,
  `queue` TEXT NOT NULL,
  `payload` LONGTEXT NOT NULL,
  `exception` LONGTEXT NOT NULL,
  `failed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `failed_jobs_uuid_unique` (`uuid` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `u539676568_Q26dW`.`files`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `u539676568_Q26dW`.`files` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `referencia` VARCHAR(255) NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `extencion` VARCHAR(255) NOT NULL,
  `confidencial` TINYINT(1) NOT NULL DEFAULT 0,
  `user_id` BIGINT(20) UNSIGNED NOT NULL,
  `solicitud_id` BIGINT(20) UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `files_nombre_user_id_unique` (`nombre` ASC, `user_id` ASC) VISIBLE,
  UNIQUE INDEX `files_referencia_unique` (`referencia` ASC) VISIBLE,
  INDEX `files_user_id_foreign` (`user_id` ASC) VISIBLE,
  INDEX `files_solicitud_id_foreign` (`solicitud_id` ASC) VISIBLE,
  CONSTRAINT `files_solicitud_id_foreign`
    FOREIGN KEY (`solicitud_id`)
    REFERENCES `u539676568_Q26dW`.`solicitudes` (`id`),
  CONSTRAINT `files_user_id_foreign`
    FOREIGN KEY (`user_id`)
    REFERENCES `u539676568_Q26dW`.`users` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `u539676568_Q26dW`.`log_solicitudes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `u539676568_Q26dW`.`log_solicitudes` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `solicitud_id` BIGINT(20) UNSIGNED NOT NULL,
  `user_id` BIGINT(20) UNSIGNED NOT NULL,
  `descripcion` VARCHAR(255) NOT NULL,
  `status` VARCHAR(255) NOT NULL DEFAULT '1',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  INDEX `log_solicitudes_user_id_foreign` (`user_id` ASC) VISIBLE,
  INDEX `log_solicitudes_solicitud_id_foreign` (`solicitud_id` ASC) VISIBLE,
  CONSTRAINT `log_solicitudes_solicitud_id_foreign`
    FOREIGN KEY (`solicitud_id`)
    REFERENCES `u539676568_Q26dW`.`solicitudes` (`id`),
  CONSTRAINT `log_solicitudes_user_id_foreign`
    FOREIGN KEY (`user_id`)
    REFERENCES `u539676568_Q26dW`.`users` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `u539676568_Q26dW`.`migrations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `u539676568_Q26dW`.`migrations` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` VARCHAR(255) NOT NULL,
  `batch` INT(11) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 14
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `u539676568_Q26dW`.`notificaciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `u539676568_Q26dW`.`notificaciones` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `solicitud_id` BIGINT(20) UNSIGNED NOT NULL,
  `emisor_id` BIGINT(20) UNSIGNED NOT NULL,
  `receptor_id` BIGINT(20) UNSIGNED NULL DEFAULT NULL,
  `message` VARCHAR(255) NOT NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `notificaciones_emisor_id_foreign` (`emisor_id` ASC) VISIBLE,
  INDEX `notificaciones_receptor_id_foreign` (`receptor_id` ASC) VISIBLE,
  INDEX `notificaciones_solicitud_id_foreign` (`solicitud_id` ASC) VISIBLE,
  CONSTRAINT `notificaciones_emisor_id_foreign`
    FOREIGN KEY (`emisor_id`)
    REFERENCES `u539676568_Q26dW`.`users` (`id`),
  CONSTRAINT `notificaciones_receptor_id_foreign`
    FOREIGN KEY (`receptor_id`)
    REFERENCES `u539676568_Q26dW`.`users` (`id`),
  CONSTRAINT `notificaciones_solicitud_id_foreign`
    FOREIGN KEY (`solicitud_id`)
    REFERENCES `u539676568_Q26dW`.`solicitudes` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `u539676568_Q26dW`.`password_reset_tokens`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `u539676568_Q26dW`.`password_reset_tokens` (
  `email` VARCHAR(255) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`email`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `u539676568_Q26dW`.`personal_access_tokens`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `u539676568_Q26dW`.`personal_access_tokens` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` VARCHAR(255) NOT NULL,
  `tokenable_id` BIGINT(20) UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `token` VARCHAR(64) NOT NULL,
  `abilities` TEXT NULL DEFAULT NULL,
  `last_used_at` TIMESTAMP NULL DEFAULT NULL,
  `expires_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `personal_access_tokens_token_unique` (`token` ASC) VISIBLE,
  INDEX `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type` ASC, `tokenable_id` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- Set character set and collation
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET character_set_connection = utf8mb4;

-- -----------------------------------------------------
-- Schema db_receitas
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `db_receitas` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `db_receitas` ;

-- -----------------------------------------------------
-- Table `db_receitas`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_receitas`.`usuarios` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '\n',
  `nome` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `login` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `senha` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `criado_em` DATETIME NOT NULL,
  `alterado_em` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `login_UNIQUE` (`login` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `db_receitas`.`categorias`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_receitas`.`categorias` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nome_UNIQUE` (`nome` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `db_receitas`.`receitas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_receitas`.`receitas` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuarios` INT(10) UNSIGNED NOT NULL,
  `id_categorias` INT(10) UNSIGNED NULL,
  `nome` VARCHAR(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `tempo_preparo_minutos` INT UNSIGNED NULL,
  `porcoes` INT UNSIGNED NULL,
  `modo_preparo` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ingredientes` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `criado_em` DATETIME NOT NULL,
  `alterado_em` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_receitas_1_idx` (`id_usuarios` ASC),
  INDEX `fk_receitas_2_idx` (`id_categorias` ASC),
  CONSTRAINT `fk_receitas_1`
    FOREIGN KEY (`id_usuarios`)
    REFERENCES `db_receitas`.`usuarios` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_receitas_2`
    FOREIGN KEY (`id_categorias`)
    REFERENCES `db_receitas`.`categorias` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `db_receitas`.`categorias`
-- -----------------------------------------------------
START TRANSACTION;
USE `db_receitas`;
INSERT INTO `db_receitas`.`categorias` (`id`, `nome`) VALUES (1, 'Bolos e tortas doces');
INSERT INTO `db_receitas`.`categorias` (`id`, `nome`) VALUES (2, 'Carnes');
INSERT INTO `db_receitas`.`categorias` (`id`, `nome`) VALUES (3, 'Aves');
INSERT INTO `db_receitas`.`categorias` (`id`, `nome`) VALUES (4, 'Peixes e frutos do mar');
INSERT INTO `db_receitas`.`categorias` (`id`, `nome`) VALUES (5, 'Saladas, molhos e acompanhamentos');
INSERT INTO `db_receitas`.`categorias` (`id`, `nome`) VALUES (6, 'Sopas');
INSERT INTO `db_receitas`.`categorias` (`id`, `nome`) VALUES (7, 'Massas');
INSERT INTO `db_receitas`.`categorias` (`id`, `nome`) VALUES (8, 'Bebidas');
INSERT INTO `db_receitas`.`categorias` (`id`, `nome`) VALUES (9, 'Doces e sobremesas');
INSERT INTO `db_receitas`.`categorias` (`id`, `nome`) VALUES (10, 'Lanches');
INSERT INTO `db_receitas`.`categorias` (`id`, `nome`) VALUES (11, 'Prato Único');
INSERT INTO `db_receitas`.`categorias` (`id`, `nome`) VALUES (12, 'Light');
INSERT INTO `db_receitas`.`categorias` (`id`, `nome`) VALUES (13, 'Alimentação Saudável');

COMMIT;

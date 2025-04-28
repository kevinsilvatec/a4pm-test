SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `db_receitas` ;
USE `db_receitas` ;

CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NULL,
  `login` VARCHAR(100) NOT NULL,
  `senha` VARCHAR(100) NOT NULL,
  `criado_em` DATETIME NOT NULL,
  `alterado_em` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `login_UNIQUE` (`login` ASC))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `categorias` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nome_UNIQUE` (`nome` ASC))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `receitas` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuarios` INT(10) UNSIGNED NOT NULL,
  `id_categorias` INT(10) UNSIGNED NULL,
  `nome` VARCHAR(45) NULL,
  `tempo_preparo_minutos` INT UNSIGNED NULL,
  `porcoes` INT UNSIGNED NULL,
  `modo_preparo` TEXT NOT NULL,
  `ingredientes` TEXT NULL,
  `criado_em` DATETIME NOT NULL,
  `alterado_em` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_receitas_1_idx` (`id_usuarios` ASC),
  INDEX `fk_receitas_2_idx` (`id_categorias` ASC),
  CONSTRAINT `fk_receitas_1`
    FOREIGN KEY (`id_usuarios`)
    REFERENCES `usuarios` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_receitas_2`
    FOREIGN KEY (`id_categorias`)
    REFERENCES `categorias` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- Insert initial categories
INSERT INTO `categorias` (`nome`) VALUES 
('Bolos e tortas doces'),
('Carnes'),
('Aves'),
('Peixes e frutos do mar'),
('Saladas, molhos e acompanhamentos'),
('Sopas'),
('Massas'),
('Bebidas'),
('Doces e sobremesas'),
('Lanches'),
('Prato Único'),
('Light'),
('Alimentação Saudável'); 
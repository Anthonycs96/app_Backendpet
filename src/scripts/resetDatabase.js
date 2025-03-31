import sequelize from '../config/database.js';

async function resetDatabase() {
    try {
        // Eliminar la base de datos existente
        await sequelize.query('DROP DATABASE IF EXISTS veterinaria_db');
        
        // Crear la base de datos nueva
        await sequelize.query('CREATE DATABASE veterinaria_db');
        
        // Seleccionar la base de datos
        await sequelize.query('USE veterinaria_db');
        
        // Sincronizar los modelos
        await sequelize.sync({ force: true });
        
        console.log('✅ Base de datos reiniciada y sincronizada exitosamente');
    } catch (error) {
        console.error('❌ Error al reiniciar la base de datos:', error);
    }
}

resetDatabase();

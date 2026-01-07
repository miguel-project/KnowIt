require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔄 Test connessione MongoDB Atlas...');
console.log('📝 URI:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@')); // Nasconde la password

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ CONNESSIONE RIUSCITA!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('⚙️  Stato:', mongoose.connection.readyState === 1 ? 'Connesso' : 'Disconnesso');
    
    // Lista collections (se esistono)
    mongoose.connection.db.listCollections().toArray()
      .then(collections => {
        console.log('📦 Collections:', collections.length > 0 ? collections.map(c => c.name).join(', ') : 'Nessuna');
        process.exit(0);
      });
  })
  .catch(err => {
    console.error('❌ ERRORE CONNESSIONE:');
    console.error('   Tipo:', err.name);
    console.error('   Messaggio:', err.message);
    
    // Suggerimenti basati sull'errore
    if (err.message.includes('authentication failed')) {
      console.error('\n💡 Soluzione: Username o password errati');
      console.error('   Vai su MongoDB Atlas → Database Access → Verifica credenziali');
    } else if (err.message.includes('IP') || err.message.includes('not allowed')) {
      console.error('\n💡 Soluzione: IP non autorizzato');
      console.error('   Vai su MongoDB Atlas → Network Access → Aggiungi il tuo IP');
    } else if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
      console.error('\n💡 Soluzione: Verifica la stringa di connessione');
      console.error('   Controlla che cluster0.n5xqi7n.mongodb.net sia corretto');
    }
    
    process.exit(1);
  });
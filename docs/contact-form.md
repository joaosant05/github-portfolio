# Envio do formulário

O formulário envia via HTTPS para o endpoint AJAX do FormSubmit e permanece na
página. O destinatário vem de `profileConfig.email`. Não são necessárias chaves
do EmailJS nem um aplicativo de e-mail no computador do visitante.

## Ativação inicial obrigatória

1. Abra o portfólio e envie uma mensagem de teste pelo formulário.
2. Na caixa de entrada de `joaogabriel.jog220@gmail.com`, procure o e-mail de
   confirmação do FormSubmit (incluindo a pasta de spam) e confirme o destinatário.
3. Envie outra mensagem para verificar a entrega. Faça essa conferência também
   no domínio publicado: a confirmação pode ser solicitada para o novo formulário.

Até a confirmação, o provedor pode aceitar uma solicitação sem entregar a
mensagem. O estado de sucesso na interface confirma a aceitação da solicitação
pelo serviço, não a chegada à caixa de entrada. Nenhuma mensagem de teste foi
enviada automaticamente durante a implementação.

Campos enviados: nome, e-mail, assunto, mensagem e campo oculto antispam. As
mensagens passam pelo FormSubmit para serem encaminhadas ao destinatário. Em caso
de falha ou tempo limite, o formulário preserva os dados e não repete o envio
automaticamente. O link separado de e-mail continua disponível como contato direto.

Documentação: https://formsubmit.co/ajax-documentation
Ativação: https://formsubmit.co/#how-it-works

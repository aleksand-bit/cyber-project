from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/test')
def test_page():
    return render_template('test.html')

@app.route('/result', methods=['POST'])
def result():
    # Собираем ответы на 10 вопросов (1 - верно, 0 - неверно)
    score = 0
    for i in range(1, 11):
        score += int(request.form.get(f'q{i}', 0))
    
    # Расширенные вердикты для шкалы из 10 баллов
    if score >= 9:
        status = "Кибер-эксперт 🛡️"
        desc = f"Превосходно! Вы набрали {score} из 10. Ваши знания цифровой гигиены находятся на профессиональном уровне. Данные под надежной защитой."
    elif 6 <= score <= 8:
        status = "Продвинутый пользователь ⚠️"
        desc = f"Хороший результат ({score} из 10). Вы отлично справляетесь с базовыми угрозами, но мошенники могут поймать вас на продвинутых методах социальной инженерии."
    elif 3 <= score <= 5:
        status = "Базовый уровень 🚨"
        desc = f"Слабая защита ({score} из 10). Вы допускаете критические ошибки: используете небезопасные сети или доверяете подозрительным файлам. Данные под угрозой."
    else:
        status = "В критической опасности 💥"
        desc = f"Вы набрали всего {score} из 10. Вы полностью беззащитны в интернете! Ваши аккаунты, деньги и личная жизнь — легкая добыча для хакеров."

    return render_template('result.html', score=score, status=status, desc=desc)

if __name__ == '__main__':
    app.run(debug=True)


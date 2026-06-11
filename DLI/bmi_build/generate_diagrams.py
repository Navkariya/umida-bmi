import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import numpy as np
import os

OUT = os.path.join(os.path.dirname(__file__), 'diagrams')
os.makedirs(OUT, exist_ok=True)

C_PRIMARY   = '#4A6CF7'
C_SECONDARY = '#7B61FF'
C_ACCENT    = '#34C759'
C_WARN      = '#FF9500'
C_DANGER    = '#FF3B30'
C_DARK      = '#1E293B'
C_LIGHT     = '#F1F5F9'
C_BLUE_L    = '#DBEAFE'
C_PURPLE_L  = '#EDE9FE'
C_GREEN_L   = '#DCFCE7'

plt.rcParams['font.family'] = 'DejaVu Sans'
plt.rcParams['font.size'] = 11
plt.rcParams['axes.facecolor'] = '#FAFBFF'
plt.rcParams['figure.facecolor'] = 'white'

def box(ax, x, y, w, h, text, fc, ec='none', tc='white', fs=10, bold=False):
    p = FancyBboxPatch((x - w/2, y - h/2), w, h,
        boxstyle='round,pad=0.12', facecolor=fc, edgecolor=ec, linewidth=1.5, zorder=3)
    ax.add_patch(p)
    fw = 'bold' if bold else 'normal'
    ax.text(x, y, text, ha='center', va='center', fontsize=fs,
            fontweight=fw, color=tc, zorder=4, wrap=True,
            multialignment='center')

def arrow(ax, x1, y1, x2, y2, color='#475569', lw=2.5):
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
        arrowprops=dict(arrowstyle='->', color=color, lw=lw), zorder=2)

def save(fig, name):
    fig.savefig(os.path.join(OUT, name), dpi=200, bbox_inches='tight', pad_inches=0.3)
    plt.close(fig)
    print(f'  saved: {name}')

# ─── 1.1 Mustaqil fikrlash darajalari (Bloom taksonomiyasi) ─────────────────
def diagram_1_1():
    fig, ax = plt.subplots(figsize=(10, 8))
    ax.set_xlim(0, 10); ax.set_ylim(0, 9)
    ax.axis('off')

    levels = [
        (5, 1.0, 8.0, 0.9, "Baholash\n(Evaluation)", C_DANGER),
        (5, 2.2, 7.2, 0.9, "Yaratish\n(Creation)", C_WARN),
        (5, 3.4, 6.4, 0.9, "Tahlil qilish\n(Analysis)", C_PRIMARY),
        (5, 4.6, 5.6, 0.9, "Qo'llash\n(Application)", C_SECONDARY),
        (5, 5.8, 4.8, 0.9, "Tushunish\n(Comprehension)", C_ACCENT),
        (5, 7.0, 4.0, 0.9, "Eslab qolish\n(Knowledge)", '#64748B'),
    ]
    for (x, w, y, h, txt, fc) in levels:
        box(ax, x, y, w, h, txt, fc, tc='white', fs=10, bold=True)

    arrow(ax, 5, 4.5, 5, 6.9, color='#94A3B8')
    ax.text(5, 8.6, "Yuqori daraja: MUSTAQIL FIKRLASH", ha='center', va='center',
            fontsize=12, fontweight='bold', color=C_DARK)
    ax.text(5, 8.1, "(Higher-Order Thinking Skills)", ha='center', va='center',
            fontsize=10, color='#64748B', style='italic')

    arrow_x = 8.5
    ax.annotate('', xy=(arrow_x, 7.5), xytext=(arrow_x, 4.2),
        arrowprops=dict(arrowstyle='->', color=C_DANGER, lw=3))
    ax.text(9.2, 5.85, "MUSTAQIL\nFIKRLASH", ha='center', va='center',
            fontsize=9, fontweight='bold', color=C_DANGER, rotation=90)

    save(fig, '1_1_bloom_taksonomiyasi.png')

# ─── 1.2 Mavjud platformalar qiyosiy tahlil ─────────────────────────────────
def diagram_1_2():
    fig, ax = plt.subplots(figsize=(12, 7))
    ax.set_facecolor('#FAFBFF')

    platforms = ['Khan\nAcademy', 'Coursera', 'Google\nClassroom', 'Socratic\n(Google)', 'MFAT\nModel']
    criteria  = ['Mustaqil\nfikrlash', 'Mahalliy\nmoslashuv', 'O\'qituvchi\nqo\'llab-\nquvvatlash',
                 'Formativ\nbaholash', 'Hamkorlik\nvositalari', 'Bepul\nfoydalanish']

    scores = np.array([
        [3, 1, 2, 3, 2, 5],
        [3, 1, 2, 2, 3, 1],
        [2, 3, 4, 3, 4, 4],
        [5, 2, 1, 3, 2, 5],
        [5, 5, 5, 5, 5, 4],
    ])

    colors = [C_WARN, C_SECONDARY, C_ACCENT, C_PRIMARY, C_DANGER]
    x = np.arange(len(criteria)); w = 0.15

    for i, (pname, score, color) in enumerate(zip(platforms, scores, colors)):
        bars = ax.bar(x + i*w - 2*w, score, w, label=pname, color=color, alpha=0.88,
                      edgecolor='white', linewidth=0.5)

    ax.set_xticks(x); ax.set_xticklabels(criteria, fontsize=9)
    ax.set_yticks([1,2,3,4,5]); ax.set_yticklabels(['1','2','3','4','5'], fontsize=9)
    ax.set_ylabel('Ball (1-5)', fontsize=10)
    ax.legend(loc='upper left', fontsize=9, ncol=5, framealpha=0.8)
    ax.set_ylim(0, 6.5)
    ax.grid(axis='y', alpha=0.3, linestyle='--')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

    save(fig, '1_2_platformalar_qiyosiy_tahlil.png')

# ─── 1.3 Raqamli ta'lim texnologiyalari tasnifi ─────────────────────────────
def diagram_1_3():
    fig, ax = plt.subplots(figsize=(14, 8))
    ax.set_xlim(0, 14); ax.set_ylim(0, 8)
    ax.axis('off')

    box(ax, 7, 7.2, 5, 0.9, "RAQAMLI TA'LIM TEXNOLOGIYALARI", C_DARK, tc='white', fs=12, bold=True)

    cats = [
        (2.0, 5.5, "Kontent\ntaqdim etish", C_PRIMARY, [
            (2.0, 4.1, "Video ma'ruzalar", C_BLUE_L, C_DARK),
            (2.0, 3.3, "Elektron darsliklar", C_BLUE_L, C_DARK),
            (2.0, 2.5, "Raqamli kutubxonalar", C_BLUE_L, C_DARK),
        ]),
        (5.3, 5.5, "Interaktiv &\nAdaptiv tizimlar", C_SECONDARY, [
            (5.3, 4.1, "ITS tizimlar", C_PURPLE_L, C_DARK),
            (5.3, 3.3, "AI o'quv yordamchilari", C_PURPLE_L, C_DARK),
            (5.3, 2.5, "Adaptiv testlar", C_PURPLE_L, C_DARK),
        ]),
        (8.6, 5.5, "Hamkorlik\nvositalari", C_ACCENT, [
            (8.6, 4.1, "Google Workspace", C_GREEN_L, C_DARK),
            (8.6, 3.3, "Aqliy xaritalar", C_GREEN_L, C_DARK),
            (8.6, 2.5, "Wikis & forums", C_GREEN_L, C_DARK),
        ]),
        (11.9, 5.5, "Baholash &\nAnalitika", C_WARN, [
            (11.9, 4.1, "Kahoot, Socrative", '#FFF3CC', C_DARK),
            (11.9, 3.3, "Learning Analytics", '#FFF3CC', C_DARK),
            (11.9, 2.5, "E-Portfolio", '#FFF3CC', C_DARK),
        ]),
    ]

    for (cx, cy, clabel, cfc, children) in cats:
        box(ax, cx, cy, 2.8, 0.85, clabel, cfc, tc='white', fs=10, bold=True)
        arrow(ax, 7, 6.75, cx, cy + 0.42, color='#94A3B8', lw=2)
        for (bx, by, btext, bfc, btc) in children:
            box(ax, bx, by, 2.6, 0.65, btext, bfc, ec='#CBD5E1', tc=btc, fs=9)
            arrow(ax, cx, cy - 0.42, bx, by + 0.32, color='#CBD5E1', lw=1.5)

    save(fig, '1_3_texnologiyalar_tasnifi.png')

# ─── 1.4 Mustaqil fikrlash komponetlari spider chart ────────────────────────
def diagram_1_4():
    categories = ['Tahlil\nqilish', 'Sintez', 'Baholash', 'Muammo\nyechish',
                  'Ijodiy\nfikrlash', 'Argumentatsiya', 'Metacognitsiya', 'Axborot\nsavodxonligi']
    N = len(categories)
    angles = [n / float(N) * 2 * np.pi for n in range(N)]
    angles += angles[:1]

    fig, ax = plt.subplots(figsize=(9, 9), subplot_kw=dict(polar=True))
    ax.set_facecolor('#FAFBFF')

    values_before = [2.5, 2.0, 2.3, 2.8, 2.2, 1.8, 2.0, 3.0]
    values_after  = [4.7, 4.5, 4.8, 4.6, 4.4, 4.2, 4.0, 4.5]
    v_b = values_before + values_before[:1]
    v_a = values_after  + values_after[:1]

    ax.plot(angles, v_b, 'o-', linewidth=2, color='#94A3B8', label="Tajriba oldi")
    ax.fill(angles, v_b, alpha=0.1, color='#94A3B8')
    ax.plot(angles, v_a, 'o-', linewidth=2.5, color=C_PRIMARY, label="Tajriba keyin")
    ax.fill(angles, v_a, alpha=0.2, color=C_PRIMARY)

    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(categories, size=10)
    ax.set_ylim(0, 5); ax.set_yticks([1, 2, 3, 4, 5])
    ax.set_yticklabels(['1','2','3','4','5'], size=8)
    ax.legend(loc='lower right', bbox_to_anchor=(1.3, -0.1), fontsize=10)
    ax.grid(color='#CBD5E1', linestyle='--', linewidth=0.8)

    save(fig, '1_4_mustaqil_fikrlash_komponentlar.png')

# ─── 2.1 MFAT Model arxitekturasi ───────────────────────────────────────────
def diagram_2_1():
    fig, ax = plt.subplots(figsize=(13, 9))
    ax.set_xlim(0, 13); ax.set_ylim(0, 9)
    ax.axis('off')

    box(ax, 6.5, 8.2, 6, 0.9, "MFAT PEDAGOGIK MODEL", C_DARK, tc='white', fs=13, bold=True)

    comps = [
        (2.0, 6.5, "DIAGNOZA &\nMAQSAD BELGILASH", C_PRIMARY, [
            "Diagnostik test\n(Kahoot, Google Forms)",
            "Individual ta'lim yo'li (ILP)",
            "Maqsad belgilash",
        ]),
        (6.5, 6.5, "FAOLIYAT &\nAMALIYOT", C_SECONDARY, [
            "Tadqiqot & kashfiyot",
            "Muammo yechish",
            "Yaratish & loyihalash",
        ]),
        (11.0, 6.5, "REFLEKSIYA &\nBAHOLASH", C_ACCENT, [
            "Metacognitsiya",
            "Formativ baholash",
            "Exit ticket & portfolio",
        ]),
    ]

    for i, (cx, cy, title, fc, items) in enumerate(comps):
        box(ax, cx, cy, 3.5, 1.0, title, fc, tc='white', fs=10, bold=True)
        arrow(ax, 6.5, 7.75, cx, cy + 0.5, color='#94A3B8', lw=2)
        for j, item in enumerate(items):
            by = cy - 1.5 - j * 1.0
            box(ax, cx, by, 3.3, 0.8, item, C_LIGHT, ec='#CBD5E1', tc=C_DARK, fs=9)
            if j == 0:
                arrow(ax, cx, cy - 0.5, cx, by + 0.4, color=fc, lw=2)
            else:
                arrow(ax, cx, by + 1.2, cx, by + 0.4, color='#CBD5E1', lw=1.5)

    arrow(ax, 3.75, 6.5, 4.75, 6.5, color=C_PRIMARY, lw=2.5)
    arrow(ax, 8.25, 6.5, 9.25, 6.5, color=C_SECONDARY, lw=2.5)
    arrow(ax, 11.0, 4.5, 2.0, 1.7, color='#94A3B8', lw=1.5)
    ax.annotate('', xy=(2.0, 3.0), xytext=(2.0, 1.8),
        arrowprops=dict(arrowstyle='->', color='#94A3B8', lw=1.5, connectionstyle='arc3,rad=0.3'))
    ax.text(7.5, 1.2, "Doiraviy jarayon — spiral rivojlanish", ha='center', va='center',
            fontsize=10, color='#64748B', style='italic')

    save(fig, '2_1_mfat_model_arxitekturasi.png')

# ─── 2.2 Dars bosqichlari ────────────────────────────────────────────────────
def diagram_2_2():
    fig, ax = plt.subplots(figsize=(13, 6))
    ax.set_xlim(0, 13); ax.set_ylim(0, 6)
    ax.axis('off')

    stages = [
        (1.5, 3, 2.5, 4.0, "FAOLLASHTIRISH\n(5-7 daqiqa)", C_WARN,
         "Mentimeter, Padlet\n'Nima bilasiz?'\nBilimlarni faollashtirish"),
        (5.0, 3, 2.5, 4.0, "CHUQURLASHISH\n(25-30 daqiqa)", C_PRIMARY,
         "Coggle, Socrative\nNearpod, Google Docs\nMustaqil tadqiqot"),
        (8.5, 3, 2.5, 4.0, "MUSTAHKAMLASH\n(8-10 daqiqa)", C_ACCENT,
         "Exit ticket\nO'zaro baholash\nRefleksiya jurnali"),
        (12.0, 3, 1.8, 4.0, "KEYINGI DARS\nREJASI", C_SECONDARY,
         "Analitika\nIndividual\nyondashuv"),
    ]

    for (cx, cy, w, h, title, fc, subtitle) in stages:
        box(ax, cx, cy + 0.8, w, 0.85, title, fc, tc='white', fs=10, bold=True)
        p = FancyBboxPatch((cx - w/2, cy - 1.5), w, 3.0,
            boxstyle='round,pad=0.1', facecolor='#F8FAFC', edgecolor=fc, linewidth=2, zorder=2)
        ax.add_patch(p)
        ax.text(cx, cy - 0.1, subtitle, ha='center', va='center',
                fontsize=9, color=C_DARK, multialignment='center', zorder=4)

    for x1, x2 in [(2.75, 3.75), (6.25, 7.25), (9.75, 11.1)]:
        arrow(ax, x1, 3, x2, 3, color='#94A3B8', lw=2.5)

    save(fig, '2_2_dars_bosqichlari.png')

# ─── 2.3 Texnologik vositalar pedagogik maqsadga bog'liqligi ────────────────
def diagram_2_3():
    fig, ax = plt.subplots(figsize=(13, 8))
    ax.set_xlim(0, 13); ax.set_ylim(0, 8)
    ax.axis('off')

    bloom_levels = [
        (6.5, 7.0, "BLOOM TAKSONOMIYASI — MUSTAQIL FIKRLASH DARAJALARI", C_DARK),
    ]
    for (x, y, t, c) in bloom_levels:
        box(ax, x, y, 9, 0.8, t, c, tc='white', fs=11, bold=True)

    rows = [
        (1.5, "BAHOLASH", C_DANGER,    "Lino.it, VoiceThread\nPeer assessment vositalari"),
        (1.5, "YARATISH",  C_WARN,     "Google Slides, Canva\nPadlet, Book Creator"),
        (1.5, "TAHLIL",    C_PRIMARY,  "Coggle, MindMeister\nComparison charts"),
        (1.5, "QO'LLASH",  C_SECONDARY,"Socrative, Kahoot\nMath simulations"),
        (1.5, "TUSHUNISH", C_ACCENT,   "Nearpod, Flipgrid\nAnnotation tools"),
        (1.5, "ESLAB QOLISH", '#64748B', "Khan Academy\nQuizlet flashcards"),
    ]
    ys = [5.8, 4.8, 3.8, 2.8, 1.8, 0.9]
    for (_, level, fc, tools), y in zip(rows, ys):
        box(ax, 2.5, y, 3.2, 0.75, level, fc, tc='white', fs=10, bold=True)
        box(ax, 7.5, y, 7.0, 0.75, tools, '#F8FAFC', ec=fc, tc=C_DARK, fs=9)
        arrow(ax, 4.1, y, 4.0, y, color=fc, lw=2)

    ax.text(2.5, 6.45, "Daraja", ha='center', fontsize=10, fontweight='bold', color=C_DARK)
    ax.text(7.5, 6.45, "Tavsiya etilgan raqamli vositalar", ha='center', fontsize=10, fontweight='bold', color=C_DARK)

    save(fig, '2_3_vositalar_bloom_bog_liq.png')

# ─── 2.4 TPACK modeli ────────────────────────────────────────────────────────
def diagram_2_4():
    fig, ax = plt.subplots(figsize=(10, 9))
    ax.set_xlim(0, 10); ax.set_ylim(0, 9)
    ax.axis('off')

    circles = [
        (3.5, 6.0, 2.5, C_PRIMARY,   0.25, "FAN BILIMI\n(CK)"),
        (6.5, 6.0, 2.5, C_SECONDARY, 0.25, "PEDAGOGIK BILIM\n(PK)"),
        (5.0, 3.5, 2.5, C_ACCENT,    0.25, "TEXNOLOGIK BILIM\n(TK)"),
    ]
    for (cx, cy, r, fc, alpha, label) in circles:
        circle = plt.Circle((cx, cy), r, color=fc, alpha=alpha, zorder=2)
        ax.add_patch(circle)
        circle_border = plt.Circle((cx, cy), r, fill=False, color=fc, linewidth=2, zorder=3)
        ax.add_patch(circle_border)
        ax.text(cx, cy + r + 0.3, label, ha='center', va='bottom',
                fontsize=10, fontweight='bold', color=fc, multialignment='center')

    intersections = [
        (5.0, 6.5, "PCK", C_WARN),
        (4.0, 4.5, "TCK", C_PRIMARY),
        (6.0, 4.5, "TPK", C_SECONDARY),
    ]
    for (x, y, label, fc) in intersections:
        ax.text(x, y, label, ha='center', va='center', fontsize=10,
                fontweight='bold', color=fc, zorder=5)

    box(ax, 5.0, 5.3, 1.6, 0.7, "TPACK", C_DARK, tc='white', fs=11, bold=True)

    ax.text(5, 8.5, "TPACK — O'qituvchi kompetentsiyasi modeli", ha='center',
            fontsize=12, fontweight='bold', color=C_DARK)
    ax.text(5, 8.1, "(Mishra & Koehler, 2006)", ha='center', fontsize=10,
            style='italic', color='#64748B')
    ax.text(5, 0.5,
        "CK=Content Knowledge | PK=Pedagogical Knowledge | TK=Technological Knowledge\n"
        "PCK=Pedagogical Content | TCK=Technological Content | TPK=Technological Pedagogical",
        ha='center', fontsize=8, color='#475569', multialignment='center')

    save(fig, '2_4_tpack_model.png')

# ─── 3.1 Test natijalari taqqoslash ─────────────────────────────────────────
def diagram_3_1():
    fig, ax = plt.subplots(figsize=(11, 6))
    ax.set_facecolor('#FAFBFF')

    categories = ["Tanqidiy\nfikrlash", "Ijodiy\nfikrlash\n(Originality)",
                  "Muammo\nyechish", "Argumentatsiya", "Metacognitsiya"]
    exp_before = [14.3, 18.2, 16.5, 15.0, 13.8]
    exp_after  = [21.7, 27.4, 24.3, 22.8, 20.5]
    ctrl_before= [14.1, 18.0, 16.2, 14.7, 13.5]
    ctrl_after = [16.2, 20.1, 18.4, 16.9, 15.3]

    x = np.arange(len(categories)); w = 0.2

    ax.bar(x - 1.5*w, exp_before,  w, label='Eksperimental (oldin)',  color=C_PRIMARY,   alpha=0.5)
    ax.bar(x - 0.5*w, exp_after,   w, label='Eksperimental (keyin)',  color=C_PRIMARY,   alpha=1.0)
    ax.bar(x + 0.5*w, ctrl_before, w, label='Nazorat (oldin)',        color='#94A3B8',   alpha=0.5)
    ax.bar(x + 1.5*w, ctrl_after,  w, label='Nazorat (keyin)',        color='#94A3B8',   alpha=1.0)

    ax.set_xticks(x); ax.set_xticklabels(categories, fontsize=9)
    ax.set_ylabel('Ball', fontsize=10)
    ax.set_ylim(0, 32)
    ax.legend(loc='upper right', fontsize=9, ncol=2)
    ax.grid(axis='y', alpha=0.3, linestyle='--')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

    for i, (eb, ea) in enumerate(zip(exp_before, exp_after)):
        pct = (ea - eb) / eb * 100
        ax.text(i - 0.5*w, ea + 0.5, f'+{pct:.0f}%', ha='center', va='bottom',
                fontsize=8, color=C_PRIMARY, fontweight='bold')

    save(fig, '3_1_test_natijalari.png')

# ─── 3.2 Foydalanuvchi baholash ─────────────────────────────────────────────
def diagram_3_2():
    fig, ax = plt.subplots(figsize=(11, 6))
    ax.set_facecolor('#FAFBFF')

    tools = ["Coggle\n(Aqliy xarita)", "Socrative\n(Interaktiv test)", "Google\nClassroom",
             "Nearpod\n(Interaktiv dars)", "Mentimeter\n(So'rov)"]
    usability    = [4.3, 4.5, 4.1, 4.4, 4.6]
    usefulness   = [4.5, 4.7, 4.3, 4.6, 4.4]
    engagement   = [4.6, 4.8, 4.0, 4.7, 4.8]

    x = np.arange(len(tools)); w = 0.25

    b1 = ax.bar(x - w, usability,  w, label="Qulay foydalanish", color=C_PRIMARY,   alpha=0.9)
    b2 = ax.bar(x,     usefulness, w, label="Foydalilik",         color=C_SECONDARY, alpha=0.9)
    b3 = ax.bar(x + w, engagement, w, label="Rag'batlantirish",   color=C_ACCENT,    alpha=0.9)

    ax.set_xticks(x); ax.set_xticklabels(tools, fontsize=9)
    ax.set_ylim(3.5, 5.3)
    ax.set_ylabel("Ball (5 ballik shkala)", fontsize=10)
    ax.legend(fontsize=10)
    ax.grid(axis='y', alpha=0.3, linestyle='--')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

    for bar_group in [b1, b2, b3]:
        for bar in bar_group:
            h = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., h + 0.02,
                    f'{h:.1f}', ha='center', va='bottom', fontsize=8)

    save(fig, '3_2_foydalanuvchi_baholash.png')

# ─── 3.3 Samaradorlik taqqoslov ─────────────────────────────────────────────
def diagram_3_3():
    fig, ax = plt.subplots(figsize=(10, 7))
    ax.set_facecolor('#FAFBFF')

    metrics = ['Tanqidiy\nfikrlash\no\'sishi (%)', "Cohen's d\n(effect size)",
               "O'quvchi\nfaolligi\n(dars ichida)", "O'qituvchi\nqoniqish\ndarajasi (%)"]
    exp_vals  = [51.7, 1.87, 78, 89]
    ctrl_vals = [14.9, 0.45, 34, 65]

    x = np.arange(len(metrics)); w = 0.3
    b1 = ax.bar(x - w/2, exp_vals,  w, label="MFAT modeli", color=C_PRIMARY, alpha=0.9)
    b2 = ax.bar(x + w/2, ctrl_vals, w, label="An'anaviy usul", color='#94A3B8', alpha=0.9)

    ax.set_xticks(x); ax.set_xticklabels(metrics, fontsize=9)
    ax.set_ylabel("Ko'rsatkich", fontsize=10)
    ax.legend(fontsize=10)
    ax.grid(axis='y', alpha=0.3, linestyle='--')
    ax.spines['top'].set_visible(False); ax.spines['right'].set_visible(False)

    for b in b1:
        h = b.get_height()
        ax.text(b.get_x() + b.get_width()/2., h + 0.5, f'{h}', ha='center', va='bottom',
                fontsize=9, fontweight='bold', color=C_PRIMARY)
    for b in b2:
        h = b.get_height()
        ax.text(b.get_x() + b.get_width()/2., h + 0.5, f'{h}', ha='center', va='bottom',
                fontsize=9, color='#64748B')

    save(fig, '3_3_samaradorlik_taqqoslash.png')

# ─── 3.4 Qiyosiy jadval (Ha/Yo'q) ────────────────────────────────────────────
def diagram_3_4():
    fig, ax = plt.subplots(figsize=(13, 8))
    ax.set_xlim(0, 13); ax.set_ylim(0, 8)
    ax.axis('off')

    criteria = [
        "Mustaqil fikrlashni rivojlantirish",
        "O'zbek tiliga moslashtirish",
        "O'qituvchi qo'llab-quvvatlash",
        "Formativ baholash tizimi",
        "Hamkorlik vositalari",
        "Narxi (bepul variant)",
        "O'qituvchi o'qitish dasturi",
        "Offline ishlash imkoniyati",
        "Maktab LMS bilan integratsiya",
        "Pedagogik nazariy asos",
        "Eksperimental samaradorlik",
        "Mahalliy qo'llab-quvvatlash",
    ]

    platforms_header = ["Mezon", "MFAT Model", "Khan Academy", "Google\nClassroom", "Socrative"]
    col_x = [0.9, 4.5, 7.0, 9.5, 12.0]
    col_colors = [C_DARK, C_DANGER, C_WARN, C_ACCENT, C_SECONDARY]

    for cx, header, fc in zip(col_x, platforms_header, col_colors):
        box(ax, cx, 7.5, 2.2 if cx == 0.9 else 2.0, 0.7, header, fc, tc='white', fs=10, bold=True)

    scores = [
        [True,  False, False, True,  False],
        [True,  False, False, False, False],
        [True,  True,  True,  True,  False],
        [True,  True,  False, True,  True],
        [True,  False, False, True,  False],
        [True,  True,  False, True,  True],
        [True,  False, False, False, False],
        [True,  False, False, False, False],
        [True,  False, True,  True,  False],
        [True,  False, False, False, True],
        [True,  False, False, False, False],
        [True,  False, False, False, False],
    ]

    for row_i, (criterion, row_scores) in enumerate(zip(criteria, scores)):
        y = 6.8 - row_i * 0.55
        bg = '#F8FAFC' if row_i % 2 == 0 else 'white'
        rect = FancyBboxPatch((0, y - 0.22), 13, 0.44,
            boxstyle='square,pad=0', facecolor=bg, edgecolor='none', zorder=1)
        ax.add_patch(rect)
        ax.text(0.9, y, criterion, ha='center', va='center', fontsize=8.5,
                color=C_DARK, multialignment='center')
        for cx, has in zip(col_x[1:], row_scores[1:]):
            color = C_ACCENT if has else C_DANGER
            symbol = '●' if has else '○'
            ax.text(cx, y, symbol, ha='center', va='center', fontsize=14, color=color, zorder=3)

    totals = [sum(1 for x in row[1:] if x) for row in scores]
    total_row_y = 6.8 - len(criteria) * 0.55 - 0.1
    ax.text(0.9, total_row_y, "JAMI BALL:", ha='center', va='center',
            fontsize=10, fontweight='bold', color=C_DARK)
    totals_cols = [sum(1 for row in scores if row[i]) for i in range(1, 5)]
    for cx, total in zip(col_x[1:], totals_cols):
        box(ax, cx, total_row_y, 1.8, 0.45, f"{total}/12", C_DARK, tc='white', fs=11, bold=True)

    save(fig, '3_4_qiyosiy_jadval.png')

# ─── 3.5 Natijalar dinamikasi (line chart) ───────────────────────────────────
def diagram_3_5():
    fig, ax = plt.subplots(figsize=(11, 6))
    ax.set_facecolor('#FAFBFF')

    weeks = list(range(0, 13, 2))
    exp_dynamic  = [14.3, 15.8, 17.2, 18.5, 20.0, 21.7, 21.7]
    ctrl_dynamic = [14.1, 14.5, 15.0, 15.4, 15.8, 16.2, 16.2]

    ax.plot(weeks, exp_dynamic,  'o-', linewidth=2.5, markersize=8, color=C_PRIMARY,
            label='Eksperimental guruh', zorder=3)
    ax.fill_between(weeks, exp_dynamic, ctrl_dynamic, alpha=0.1, color=C_PRIMARY)
    ax.plot(weeks, ctrl_dynamic, 's--', linewidth=2, markersize=7, color='#94A3B8',
            label='Nazorat guruh', zorder=3)

    ax.set_xlabel('Hafta', fontsize=10)
    ax.set_ylabel('WGCTA ball', fontsize=10)
    ax.set_xticks(weeks)
    ax.set_xticklabels([f'{w}-hafta' for w in weeks], fontsize=9)
    ax.set_ylim(12, 24)
    ax.legend(fontsize=10)
    ax.grid(alpha=0.3, linestyle='--')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

    for w, v in zip(weeks, exp_dynamic):
        ax.annotate(f'{v}', (w, v), textcoords='offset points', xytext=(0, 8),
                    ha='center', fontsize=8.5, color=C_PRIMARY)

    save(fig, '3_5_natijalar_dinamikasi.png')

# Run all
print("Diagrammalar generatsiya qilinmoqda...")
diagram_1_1()
diagram_1_2()
diagram_1_3()
diagram_1_4()
diagram_2_1()
diagram_2_2()
diagram_2_3()
diagram_2_4()
diagram_3_1()
diagram_3_2()
diagram_3_3()
diagram_3_4()
diagram_3_5()
print("Barcha diagrammalar tayyor!")

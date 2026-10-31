"""Mapeia recortes das folhas originais sem modificar suas imagens."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageChops
import json

ROOT = Path(__file__).resolve().parents[1]
SOURCES = {
    'luketa': 'Folha de sprites do luketa.png',
    'tuca': 'Folha de sprites tuca.png',
    'teca': 'Sprite teca fase1.png',
    'lea': 'Sprite Sheet da lea.png',
}
# Cada retângulo isola um quadro; as folhas não usam uma grade regular.
REGIONS = {
    'luketa': {
        'idle': [(30,40,87,171),(130,40,86,171),(225,40,86,171)],
        'run': [(508,40,92,171),(601,40,94,171),(695,40,96,171),(788,40,95,171),(884,40,97,171),(982,40,101,171)],
        'shoot': [(330,416,135,163),(465,416,114,163),(576,416,124,163)],
        'sling': [(802,416,96,163),(913,416,116,163),(1032,416,120,163),(1157,416,131,163)],
        'slide': [(992,610,165,148),(1157,610,151,148)],
    },
    'tuca': {
        'idle': [(37,44,83,165),(124,44,81,165),(211,44,83,165)],
        'run': [(484,44,82,165),(567,44,85,165),(653,44,85,165),(738,44,83,165),(821,44,92,165),(912,44,87,165),(1000,44,88,165)],
        'shoot': [(343,415,122,155),(464,415,114,155),(576,415,114,155)],
        'sling': [(816,415,92,155),(924,415,105,155),(1042,415,110,155),(1164,415,127,155)],
        'slide': [(990,604,167,139),(1157,604,153,139)],
    },
    'teca': {
        'idle': [(45,43,150,293),(1065,633,157,293),(45,633,150,293)],
        'run': [(45,43,150,293),(45,348,150,293),(1065,633,157,293),(45,633,150,293)],
        'shoot': [(195,43,152,293),(350,43,156,293),(505,43,164,293),(790,43,165,293),(1090,43,180,293)],
        'sling': [(195,43,152,293),(350,43,156,293),(505,43,164,293),(790,43,165,293),(1090,43,180,293)],
        'slide': [(195,348,171,293),(365,348,170,293),(195,633,167,293)],
    },
    'lea': {
        'idle': [(29,36,91,174),(124,36,90,174),(218,36,90,174)],
        'run': [(537,36,107,174),(645,36,98,174),(742,36,94,174),(836,36,98,174),(934,36,92,174),(1026,36,94,174)],
        'shoot': [(357,405,117,171),(476,405,107,171),(583,405,120,171)],
        'sling': [(789,405,116,171),(912,405,126,171),(1038,405,119,171),(1158,405,134,171)],
        'slide': [(996,603,170,143),(1166,603,154,143)],
    },
}

# Contornos evitam que braços e pés dos quadros vizinhos apareçam no arremesso.
SHOOT_EDGES = {
    'luketa': [(5,0,135,104),(0,24,114,85),(0,22,124,91)],
    'tuca': [(0,0,122,99),(0,18,109,88),(0,21,114,85)],
    'lea': [(0,17,102,94),(-17,25,99,85),(-13,25,120,91)],
}

def frame(image, region, clip=None):
    x,y,w,h=region
    alpha=image.getchannel('A').crop((x,y,x+w,y+h))
    mask=alpha.point(lambda a: 255 if a>150 else 0)
    if clip:
        contour=Image.new('L',(w,h)); ImageDraw.Draw(contour).polygon(clip,fill=255)
        mask=ImageChops.multiply(mask,contour)
    bounds=mask.getbbox()
    if bounds is None:
        raise ValueError(f'Quadro vazio: {region}')
    left,top,right,bottom=bounds
    # O centro da cabeça ancora corpo e braços sem deslocar o personagem ao atirar.
    head=mask.crop((0,top,w,min(bottom,top+55))).getbbox()
    center=(head[0]+head[2])/2 if head else (left+right)/2
    result={'rect':list(region),'anchor':[round(center,1),bottom]}
    if clip: result['clip']=clip
    return result

layouts={}
for character, filename in SOURCES.items():
    source=ROOT/'assets/personagens'/filename
    if not source.exists() and character=='lea':
        source=ROOT/'assets/personagens/Sprite Sheet da Garota Pixel Art.png'
    image=Image.open(source)
    animations={}
    for pose, regions in REGIONS[character].items():
        frames=[]
        for index,r in enumerate(regions):
            clip=None
            if pose=='shoot' and character!='teca':
                x,y,w,h=r
                left,extra,right,footright=SHOOT_EDGES[character][index]
                # A perna traseira invade a coluna anterior na folha original.
                r=(x-extra,y,w+extra,h)
                shoulder=90 if character=='lea' else 84
                clip=[(left+extra,0),(min(right,100)+extra,0),(min(right,100)+extra,65),
                      (right+extra,65),(right+extra,shoulder),(footright+extra,112),
                      (footright+extra,h),(0,h),(0,125),(max(0,left)+extra,shoulder),
                      (max(0,left)+extra,80),(left+extra,65)]
            elif pose=='slide' and character!='teca':
                x,y,w,h=r
                clip=[(0,0),(w-18,0),(w-18,100),(w,100),(w,h),(0,h)]
            elif character=='lea' and pose=='sling' and index==1:
                x,y,w,h=r
                clip=[(0,0),(w-22,0),(w-22,65),(w,65),(w,h),(0,h)]
            if character=='teca':
                # A nova folha tem poses independentes e itens de ataque entre os recortes.
                x,y,w,h=r
                alpha=image.getchannel('A').crop((x,y,x+w,y+h))
                mask=alpha.point(lambda a: 255 if a>150 else 0)
                bounds=mask.getbbox()
                if bounds is None: raise ValueError(f'Quadro vazio: {r}')
                left,top,right,bottom=bounds
                head=mask.crop((0,top,w,min(bottom,top+80))).getbbox()
                center=(head[0]+head[2])/2 if head else (left+right)/2
                frames.append({'rect':list(r),'anchor':[round(center,1),bottom]})
            else:
                frames.append(frame(image,r,clip))
        animations[pose]={'fps':3 if pose=='idle' else 12,'loop':pose in ['idle','run'],'frames':frames}
    # A folha não possui salto livre isolado; usamos a pose de corrida com pernas recolhidas.
    animations['jump']={'fps':1,'loop':False,'frames':[animations['run']['frames'][0]]}
    layouts[character]={'referenceHeight':300 if character=='teca' else 160,'animations':animations}

target=ROOT/'assets/jogo/animacoes.js'
target.write_text('// Recortes em pixels das folhas originais. Gerado por tools/map-character-atlases.py.\nwindow.EaiCharacterAtlases = '+json.dumps(layouts,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
print('Mapeadas folhas de Luketa, Tuca e Lea; originais preservados.')

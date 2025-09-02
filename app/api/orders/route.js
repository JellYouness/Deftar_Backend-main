// app/api/orders/route.js
import db from "../../lib/db.js";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// API CREATE ORDER
export async function POST(request) {
  try {
    const formData = await request.formData();

    const {
      type_carnet,
      nom_arabe,
      nom_francais,
      email,
      telephone,
      direction_provinciale,
      etablissement,
      region,
      matiere,
      cycle,
      date_commande,
      statut_commande,
      numero_commande,
      methode_paiement,
      banque_choisie,
      rib_choisi,
      montant,
    } = Object.fromEntries(formData);

    // Validation des champs requis
    if (!nom_arabe || !email || !telephone || !matiere) {
      return Response.json(
        {
          error:
            "Champs requis manquants: nom_arabe, email, telephone, matiere",
        },
        { status: 400 }
      );
    }

    if (methode_paiement === "virement" && (!banque_choisie || !rib_choisi)) {
      return Response.json(
        {
          error: "Banque choisie et RIB requis pour le virement",
        },
        { status: 400 }
      );
    }

    const recu = formData.get("recu");
    if (!recu) {
      return Response.json(
        {
          error: "Reçu de paiement requis",
        },
        { status: 400 }
      );
    }

    const isCustom = type_carnet === "custom";
    const emploi_temps = formData.get("emploi_temps");

    if (isCustom && !emploi_temps) {
      return Response.json(
        {
          error: "Emploi du temps requis pour le type personnalisé",
        },
        { status: 400 }
      );
    }

    // Handle file uploads
    let emploi_temps_url = null;
    let recu_url = null;

    if (emploi_temps) {
      const bytes = await emploi_temps.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${emploi_temps.name}`;
      const uploadDir = path.join(process.cwd(), "uploads", "emploi_temps");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), buffer);
      emploi_temps_url = `/uploads/emploi_temps/${filename}`;
    }

    if (recu) {
      const bytes = await recu.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${recu.name}`;
      const uploadDir = path.join(process.cwd(), "uploads", "recu");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), buffer);
      recu_url = `/uploads/recu/${filename}`;
    }

    const parsedMontant = parseFloat(montant) || (isCustom ? 50.0 : 30.0);

    const sql = `
    INSERT INTO commandes 
    (type_carnet, nom_arabe, nom_francais, email, telephone, direction_provinciale, etablissement, region, matiere, cycle, emploi_temps_url, date_commande, statut_commande, numero_commande, methode_paiement, banque_choisie, rib_choisi, recu_url, montant) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
    RETURNING id
  `;

    const client = await db.connect();

    const result = await client.query(sql, [
      type_carnet || "standard",
      nom_arabe,
      nom_francais || null,
      email,
      telephone,
      direction_provinciale || null,
      etablissement || null,
      region || null,
      matiere,
      cycle || null,
      emploi_temps_url,
      date_commande || new Date().toISOString().slice(0, 19).replace("T", " "),
      statut_commande || "en_attente",
      numero_commande || `CMD_${Date.now()}`,
      methode_paiement || null,
      banque_choisie || null,
      rib_choisi || null,
      recu_url,
      parsedMontant,
    ]);

    client.release();

    return Response.json({
      success: true,
      id: result.rows[0].id,
      emploi_temps_url,
      numero_commande,
      recu_url,
      message: "Commande créée avec succès",
    });
  } catch (err) {
    console.error("Erreur insertion commande:", err);
    return Response.json(
      {
        error: "Erreur lors de l'enregistrement de la commande",
      },
      { status: 500 }
    );
  }
}

// API GET ORDERS
export async function GET() {
  try {
    const client = await db.connect();

    const sql = `
      SELECT 
        id,
        type_carnet AS typeCarnet,
        numero_commande AS orderNumber,
        nom_arabe AS teacherName,
        email,
        telephone AS phone,
        matiere AS subject,
        cycle AS level,
        region,
        statut_commande AS status,
        date_commande AS orderDate,
        methode_paiement,
        banque_choisie,
        rib_choisi,
        recu_url,
        emploi_temps_url,
        direction_provinciale,
        etablissement,
        nom_francais,
        montant
      FROM commandes
      ORDER BY date_commande DESC
    `;

    const result = await client.query(sql);
    client.release();

    return Response.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (err) {
    console.error("Erreur SELECT commandes:", err);
    return Response.json(
      {
        error: "Erreur récupération commandes",
      },
      { status: 500 }
    );
  }
}

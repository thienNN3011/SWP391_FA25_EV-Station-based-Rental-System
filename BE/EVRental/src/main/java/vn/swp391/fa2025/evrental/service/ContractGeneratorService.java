package vn.swp391.fa2025.evrental.service;

import org.docx4j.Docx4J;
import org.docx4j.fonts.IdentityPlusMapper;
import org.docx4j.fonts.Mapper;
import org.docx4j.fonts.PhysicalFonts;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.docx4j.openpackaging.parts.WordprocessingML.MainDocumentPart;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.util.Map;

@Service
public class ContractGeneratorService {

    public byte[] generatePdfContract(Map<String, String> data) throws Exception {
        String currentDir = System.getProperty("user.dir");
        File projectRoot = new File(currentDir).getParentFile().getParentFile();
        File templateFile = new File(projectRoot, "EVRental_Contract.docx");

        if (!templateFile.exists()) {
            throw new RuntimeException("Không tìm thấy file hợp đồng mẫu tại: " + templateFile.getAbsolutePath());
        }
        WordprocessingMLPackage wordMLPackage = WordprocessingMLPackage.load(templateFile);
        MainDocumentPart mainDocumentPart = wordMLPackage.getMainDocumentPart();
        mainDocumentPart.variableReplace(data);
        Mapper fontMapper = new IdentityPlusMapper();
        PhysicalFonts.discoverPhysicalFonts();
        fontMapper.put("Times New Roman", PhysicalFonts.get("Times New Roman"));
        fontMapper.put("Arial", PhysicalFonts.get("Arial"));
        fontMapper.put("Tahoma", PhysicalFonts.get("Tahoma"));
        wordMLPackage.setFontMapper(fontMapper);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Docx4J.toPDF(wordMLPackage, out);
        return out.toByteArray();
    }
}

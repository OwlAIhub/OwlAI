"use client";

import { Button } from "@/components/ui/buttons/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/cards/card";
import { Input } from "@/components/ui/inputs/input";
import { Label } from "@/components/ui/inputs/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ResponsiveContainer,
  ResponsiveText,
} from "@/components/ui/responsive-container";
import {
  contactService,
  type ContactFormData,
} from "@/lib/services/contactService";
import { useState } from "react";
import {
  CheckCircle,
  Send,
  Loader2,
  MessageSquare,
  Mail,
  Phone,
  Building,
} from "lucide-react";
import { motion } from "framer-motion";

const INQUIRY_TYPES = [
  { value: "general", label: "General Inquiry" },
  { value: "support", label: "Technical Support" },
  { value: "partnership", label: "Partnership" },
  { value: "feedback", label: "Feedback" },
  { value: "feature_request", label: "Feature Request" },
  { value: "bug_report", label: "Bug Report" },
  { value: "billing", label: "Billing" },
  { value: "other", label: "Other" },
];

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
    phone: "",
    subject: "",
    company: "",
    inquiryType: "general",
  });

  const handleInputChange =
    (field: keyof ContactFormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      setError(null);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await contactService.submitContact(formData);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        message: "",
        phone: "",
        subject: "",
        company: "",
        inquiryType: "general",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section
        id="contact"
        className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-white"
      >
        <ResponsiveContainer maxWidth="5xl" padding="none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-secondary/50 to-accent/5 shadow-lg">
              <CardContent className="pt-12 pb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <ResponsiveText
                    as="h3"
                    fluid={true}
                    clamp={{
                      min: "1.25rem",
                      preferred: "0.75rem + 2.5vw",
                      max: "2rem",
                    }}
                    className="font-bold text-foreground mb-4"
                  >
                    Thank You!
                  </ResponsiveText>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    We&apos;ve received your message and will get back to you
                    soon. Our team typically responds within 24 hours.
                  </p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </ResponsiveContainer>
      </section>
    );
  }

  return (
    <section
      id="contact"
      className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-white"
    >
      <ResponsiveContainer maxWidth="5xl" padding="none">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-2xl mb-3 sm:mb-4"
          >
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </motion.div>
          <ResponsiveText
            as="h2"
            fluid={true}
            clamp={{
              min: "1.5rem",
              preferred: "0.875rem + 3vw",
              max: "2.25rem",
            }}
            className="font-bold text-foreground mb-3 sm:mb-4 leading-tight px-4"
          >
            <span className="text-foreground">Get in </span>
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent relative">
              Touch
              <div className="absolute -bottom-2 left-0 right-0">
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80"></div>
                <div className="w-3/4 h-0.5 bg-gradient-to-r from-primary/40 to-accent/40 mx-auto mt-1 rounded-full"></div>
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
              </div>
            </span>
          </ResponsiveText>
          <ResponsiveText
            as="p"
            fluid={true}
            clamp={{
              min: "0.875rem",
              preferred: "0.5rem + 1.5vw",
              max: "1.125rem",
            }}
            className="text-muted-foreground max-w-2xl mx-auto px-4"
          >
            Have a question or need assistance? We&apos;d love to hear from you.
            Send us a message and we&apos;ll respond as soon as possible.
          </ResponsiveText>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-border/50 shadow-lg bg-card">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                Send us a Message
              </CardTitle>
              <p className="text-muted-foreground text-sm sm:text-base">
                Fill out the form below and we&apos;ll get back to you within 24
                hours
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
                  >
                    <p className="text-destructive text-sm font-medium">
                      {error}
                    </p>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-foreground flex items-center gap-2"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange("name")}
                      placeholder="Your full name"
                      className="border-border/80 focus:border-primary focus:ring-primary/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-foreground flex items-center gap-2"
                    >
                      <Mail className="w-3 h-3 text-primary" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange("email")}
                      placeholder="your@email.com"
                      className="border-border/80 focus:border-primary focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-foreground flex items-center gap-2"
                    >
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange("phone")}
                      placeholder="+91 98765 43210"
                      className="border-border/80 focus:border-primary focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="company"
                      className="text-sm font-medium text-foreground flex items-center gap-2"
                    >
                      <Building className="w-3 h-3 text-muted-foreground" />
                      Company
                    </Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={handleInputChange("company")}
                      placeholder="Your company name"
                      className="border-border/80 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="inquiryType"
                      className="text-sm font-medium text-foreground"
                    >
                      Inquiry Type
                    </Label>
                    <select
                      id="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange("inquiryType")}
                      className="w-full p-3 border border-border/80 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background text-foreground text-sm"
                    >
                      {INQUIRY_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="subject"
                      className="text-sm font-medium text-foreground"
                    >
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={handleInputChange("subject")}
                      placeholder="Brief subject of your message"
                      className="border-border/80 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={handleInputChange("message")}
                    placeholder="Tell us how we can help you..."
                    rows={6}
                    className="border-border/80 focus:border-primary focus:ring-primary/20 resize-none"
                    required
                  />
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium py-3 h-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </ResponsiveContainer>
    </section>
  );
}
